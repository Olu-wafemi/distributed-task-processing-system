import { ConnectToRabbitMQ, getRabbitMQChannel } from "../config/rabbitmq";
import { PdfToDocxTask } from "../services/pdfConverter"; 
import { uploadDocxToCloudinary } from "../services/cloudinary"; 
import {prisma} from "../config/db"
import amqp from 'amqplib';
import { emit } from "process";


import fs from "fs-extra";
import * as dotenv from "dotenv"
import path from "path";
dotenv.config()
const RABBITMQ_URL = process.env.RABBITMQ_URL as string

const processPdfToWord = async (taskData: any) =>{

    const {pdfData, taskId} = taskData;
    const docxPath = await PdfToDocxTask(taskData);

    try{
        
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
        fs.removeSync(docxPath)
           
            
        fs.removeSync(path.join(__dirname, "..", `uploads/${taskId}.pdf` ) )
    }
    catch(error){
        fs.removeSync(docxPath)
           
            
        fs.removeSync(path.join(__dirname, "..", `uploads/${taskId}.pdf` ) )

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
