import {getRabbitMQChannel} from "../config/rabbitmq"
import { task } from '@prisma/client';


export const addImageUploadTask = async(taskData: any) =>{
    const channel = getRabbitMQChannel();
    //console.log(channel)
    const task = {type: 'image-upload', ...taskData};

    //console.log(task)

    channel.sendToQueue('imageUploadQueue', Buffer.from(JSON.stringify(task)));

}

export const addPdfConversionTask = async(taskData: any) =>{
    const channel = getRabbitMQChannel();
    const task = {type: 'pdf-to-word', ...taskData};
    channel.sendToQueue('pdfToWOrdQueue', Buffer.from(JSON.stringify(task)));
};