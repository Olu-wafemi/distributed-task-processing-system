
import { prisma } from "../config/db";

import { uploadImageToCloudinary } from '../services/cloudinary';


import { ConnectToRabbitMQ, getRabbitMQChannel } from "../config/rabbitmq";
import amqp from 'amqplib';
import { channel } from 'diagnostics_channel';

const queue_name = process.env.QUEUE_NAME as string

const RABBITMQ_URL:any = process.env.RABBITMQ_URL;
const processImageUpload = async (taskData: any) =>{
    const {imageData,taskId} = taskData;
    try{
        //console.log(taskId)
        const uploadedImage = await uploadImageToCloudinary(imageData);
        
        await prisma.task.create({
            data: {
                taskId: taskId,
                filePath: uploadedImage.url,
                status: "completed"
                
            }
        })
    }
    catch(error){
        console.log(`Image upload task`)
    }
}

const consumeImageUploadQueue = async() =>{
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    
    await  channel.assertQueue("imageUploadQueue", {durable: true})
    await  channel.assertQueue("imageUploadQueu", {durable: true})
    console.log("Worker listening for Queue")
    channel.consume('imageUploadQueue', async (msg: any)=>{
        //console.log("QUEUE RECEIVED")
        //console.log(msg)
        const taskData = JSON.parse(msg.content.toString())
        await processImageUpload(taskData)
        console.log("Image succesfully processed")
        channel.ack(msg)

    })
}


consumeImageUploadQueue()
