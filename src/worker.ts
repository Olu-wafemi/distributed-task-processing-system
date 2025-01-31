import amqp from "amqplib";

import {prisma} from './config/db';
import { resolve } from "path";

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
    }
}