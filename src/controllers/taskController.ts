import {Request, Response, NextFunction} from "express"
import { addImageUploadTask, addPdfConversionTask } from "../services/taskService";
import  {generateTaskId } from "../utils/generateId";


interface TaskBody{
    type :string;
}


const uploadImageController = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{

   try{
   
        const imageData = req.file?.buffer.toString('base64');
        if(!imageData){
            res.status(400).json({status: false, message: "No image detected"});

        }

        const taskId = generateTaskId();
        await addImageUploadTask({imageData, taskId})
        res.status(201).json({message: "Task Queued", taskId});
    }
   catch (error){
       
       res.status(500).json({error: "Internal server error",})
        next(error);
    }



};

const PdfToWordController = async(req:Request, res: Response)=>{

   try{
    const pdfData = req.file?.buffer.toString('base64');
    if(!pdfData){
         res.status(400).json({error: "No PDF file detected"});
    }

    const taskId = generateTaskId();
    await addPdfConversionTask({pdfData, taskId});

    res.status(202).json({message: "Task Queued", taskId})

   }
   catch(error){
    res.status(500).json({status: false, error: "Internal server error"})
    
   }
}

export {PdfToWordController, uploadImageController}

