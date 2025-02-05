import amqp from "amqplib";
import dotenv from "dotenv"
import e from "express";


const RABBITMQ_URL:any = process.env.RABBITMQ_URL;

const queue_name = process.env.QUEUE_NAME as string

let channel: amqp.Channel;
let connection: amqp.Connection
export const ConnectToRabbitMQ = async ()=>{
    try{
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('imageUploadQueue', {durable: true});
        await channel.assertQueue("pdfToWordQueue", {durable: true});
        console.log("Queues are ready")
        
        }
        catch(error){
            console.error("RabbitMQ connection error", error);
        }

}



export const getRabbitMQChannel = (): amqp.Channel=>{
    if(!channel){
        console.error("channel is not initalized yet")
        
    }

    return channel;
};

export const closeRabbitMQ = async() =>{
    await channel.close();
    await connection.close();

} 




