
import {task} from "@prisma/client";
import {prisma} from '../config/db';
import path from "path"
// @ts-ignore
import ConvertAPI from 'convertapi';
import * as dotenv from "dotenv"
dotenv.config()


import { config} from "../../config"



const convertapi = new ConvertAPI( config.secretKey!,  { conversionTimeout: 60 })

export const PdfToDocxTask = async(taskData: any): Promise<string> =>{



    try{
        const {tempfilepath,taskId} = taskData

       

        const outputFilePath = path.join(__dirname, ".." ,  `uploads/${taskId}.docx`);
        const result = await convertapi.convert('docx', {File: tempfilepath}, "pdf")
        await result.saveFiles(outputFilePath)

        return outputFilePath
    }
    catch(err){
        return "Internal Server error" 


    }
}