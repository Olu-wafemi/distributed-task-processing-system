import { task } from '@prisma/client';
import {prisma } from '../config/db';
import fs from 'fs';
import path from 'path';
import { ConnectToRabbitMQ, getRabbitMQChannel } from '../config/rabbitmq';
import amqp from 'amqplib';



export const submitImageUploadTask = async (filePath: string, taskId: string)=>{
    const channel = getRabbitMQChannel();
    const task = {taskId, filePath};

    channel.sendToQueue("imageUploadQueue", Buffer.from(JSON.stringify(task)), {
        persistent: true
    })

    console.log(`Image upload task with Id ${taskId} sent to Queue`);
}