import amqp from "amqplib";

import {prisma} from './config/db';
import { resolve } from "path";
import { channel } from 'diagnostics_channel';

const QUEUE_NAME = process.env.QUEUE_NAME as string

const processTask = async(task: {id: string; type: string}) =>{

    console.log(`Processing task: ${task.id}, Type: ${task.type}`)

    try{
        await new Promise((resolve) => setTimeout(resolve, 2000));

        await prisma.task.update({
            where:{id: task.id},
            data: {status: 'completed'}
        })

        console.log(`Task ${task.id} completed`)
    }
    catch(error){
        console.error(`Error processing task ${task.id}`)

        await prisma.task.update({
            where: {id: task.id},
            data: {status: "failed"}
        })
    }
}

const startWorker = async () =>{

    try{
        const connection = await amqp.connect(process.env.RABBITMQ_URL as string)
        const channel = await connection.createChannel();

        await channel.assertQueue(QUEUE_NAME, {durable: true});

        console.log(`Worker listening to queue: ${QUEUE_NAME}`)

        channel.consume(QUEUE_NAME, async(msg)=>{
            if(msg){
                const task = JSON.parse(msg.content.toString());
                await processTask(task);
                channel.ack(msg)

            }

        })



    }catch(error){
        console.error('Worker error:', error)
    }
}

startWorker()