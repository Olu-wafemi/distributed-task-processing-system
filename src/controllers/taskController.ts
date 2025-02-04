import {Request, Response, NextFunction} from "express"
import { addImageUploadTask, addPdfConversionTask } from "../services/taskService";
import  {generateTaskId } from "../utils/generateId";
import path from "path";
import fs from 'fs-extra';




const uploadImageController = async(req: Request, res: Response, next: NextFunction): Promise<any>    =>{

   try{


        //console.log(req.file)
   
        const imageData = req.file?.buffer.toString('base64');
        if(!imageData){
            return res.status(400).json({status: false, message: "No image detected"});

        }
        

        const taskId = generateTaskId();
        await addImageUploadTask({imageData, taskId})
       return res.status(201).json({message: "Task Queued", taskId});
    }
   catch (error){
        console.log(error)
       
      return  res.status(500).json({error: "Internal server error",})
        
    }



};

const PdfToWordController = async(req:Request, res: Response):Promise<any>=> {

   try{

      
    
    if(!req.file){
      return  res.status(400).json({error: "No PDF file detected"});
    }
    const taskId = generateTaskId();
    const tempDir = path.join(__dirname, "..", 'uploads');
    const tempfilepath = path.join(tempDir, `${taskId}.pdf`);

    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFileSync(tempfilepath, req.file.buffer)

    
    await addPdfConversionTask({tempfilepath, taskId});

    return res.status(202).json({message: "Task Queued", taskId})

  }
    catch(error){

      console.error(error)
    return res.status(500).json({status: false, error: "Internal server error"})
    
    }
}

export {PdfToWordController, uploadImageController}

