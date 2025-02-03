import {task} from "@prisma/client";
import {prisma} from '../config/db';
import path from "path"
import convertapi from 'convertapi';
const api = convertapi(process.env.API_SECRET as string)

export const PdfToDocxTask = async(taskData: any): Promise<string> =>{

    try{
        const {pdfData,taskId} = taskData

        const outputFilePath = path.join('uploads/word/', `${taskId}.docx`);
         const result = api.convert('docx', {
            File: pdfData
        })

        result.saveFiles(outputFilePath);

        return outputFilePath


    }
    catch(err){
        return "Internal Server error" 


    }
}