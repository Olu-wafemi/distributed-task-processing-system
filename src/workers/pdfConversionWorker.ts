import { ConnectToRabbitMQ, getRabbitMQChannel } from "../config/rabbitmq";
import { PdfToDocxTask } from "../services/pdfConverter"; 
import { uploadDocxToCloudinary } from "../services/cloudinary"; 

const processPdfToWord = async (taskData: any) =>{

    const {pdfData, taskId} = taskData;

    try{
        const wordFile = await PdfToDocxTask(pdfData);
        const uploadedWord = await uploadDocxToCloudinary(wordFile)
    }
}