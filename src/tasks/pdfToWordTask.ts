import {task} from "@prisma/client";
import {prisma} from '../config/db';
import path from "path"
import convertapi from 'convertapi';
const api = convertapi(process.env.API_SECRET as string)

export const PdfToDocxTask = async(task: task)=>{

    try{
        const pdfPath = task.filePath;

        const outputFilePath = path.join('uploads/word/', `${task.id}.docx`);
         const result = api.convert('docx', {
            File: pdfPath
        })

        result.saveFiles(outputFilePath);
    }
    catch(err){
        await prisma.task.update({
            where:{id: task.id},
            data: {status: "failed"}
        })


    }
}