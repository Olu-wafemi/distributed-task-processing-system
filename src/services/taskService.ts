import {task} from "@prisma/client";
import { prisma } from "../config/db";
import { handleImageUploadTask } from "../tasks/imageUpload";
import { PdfToDocxTask } from "../tasks/pdfToWordTask";

export const submitTask = async(taskPayload: any)=>{

    const task = await prisma.task.create({
        data: {
            type: taskPayload.type,
            status: "pending",
            filePath: taskPayload.filePath
        }
    })
    if(task.type === "image_upload"){
        handleImageUploadTask(task)
    }else if(task.type === "pdf_to_word"){
        PdfToDocxTask(task)
    }

    return task;
}