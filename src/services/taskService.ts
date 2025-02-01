import {getRabbitMQChannel} from "../config/rabbitmq"
import { task } from '@prisma/client';

const channel = getRabbitMQChannel();
export const addImageUploadTask = async(taskData: any) =>{

    const task = {type: 'image-upload', ...taskData};

    channel.sendToQueue('imageUploadQueue', Buffer.from(JSON.stringify(task)));

}

export const addPdfConversionTask = async(taskData: any) =>{
    const task = {type: 'pdf-to-word', ...taskData};
    channel.sendToQueue('pdfToWOrdQueue', Buffer.from(JSON.stringify(task)));
};