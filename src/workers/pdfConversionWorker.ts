import { ConnectToRabbitMQ, getRabbitMQChannel } from "../config/rabbitmq";
import { PdfToDocxTask } from "../services/pdfConverter"; 
import { uploadDocxToCloudinary } from "../services/cloudinary"; 
import {prisma} from "../config/db"
import amqp from 'amqplib';
import { emit } from "process";

import * as dotenv from "dotenv"
dotenv.config()
const RABBITMQ_URL = process.env.RABBITMQ_URL as string

const processPdfToWord = async (taskData: any) =>{

    const {pdfData, taskId} = taskData;

    try{
        const docxPath = await PdfToDocxTask(taskData);
        if(!docxPath){
            return "PDf Conversion Failed"
        }

     
        const uploadedWord = await uploadDocxToCloudinary({docxPath, taskId})
        

        await prisma.task.create({
            data: {
                taskId: taskId,
                filePath: uploadedWord.url,
                status: "completed"
            }
        })
    }
    catch(error){

        console.log(error)


    }
}



const consumePdfToWordQueue = async () =>{
    const connection = await amqp.connect(RABBITMQ_URL)
    const channel = await connection.createChannel()

    await channel. assertQueue("pdfToWOrdQueue", {durable: true})
    console.log("Worker listening for Queue")
    

    channel.consume('pdfToWOrdQueue', async(msg:any)=>{

        console.log("Task received")

        

        const taskData = JSON.parse(msg.content.toString());

       

        
        await processPdfToWord(taskData);

        console.log("Task Completed")

         
        channel.ack(msg)

    
    } )
}

consumePdfToWordQueue()
