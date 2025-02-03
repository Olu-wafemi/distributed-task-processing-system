import { ConnectToRabbitMQ, getRabbitMQChannel } from "../config/rabbitmq";
import { PdfToDocxTask } from "../services/pdfConverter"; 
import { uploadDocxToCloudinary } from "../services/cloudinary"; 
import {prisma} from "../config/db"


const processPdfToWord = async (taskData: any) =>{

    const {pdfData, taskId} = taskData;

    try{
        const wordFile = await PdfToDocxTask(pdfData);
        const uploadedWord = await uploadDocxToCloudinary(wordFile)

        await prisma.task.create({
            data: {
                taskId: taskId,
                filePath: uploadedWord.url,
                status: "completed"
            }
        })
    }
    catch(error){


    }
}



const consumePdfToWordQueue = async () =>{
    const channel = getRabbitMQChannel();
    channel.consume('pdfToWOrdQueue', async(msg:any)=>{

        const taskData = JSON.parse(msg.content.toString());
        await processPdfToWord(taskData);
        channel.ack(msg)
    } )
}
