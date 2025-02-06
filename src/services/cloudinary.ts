import {v2 as cloudinary} from "cloudinary"
import { error } from "console"
import path from "path"

import dotenv from "dotenv"


import fs from "fs-extra"
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

export const uploadImageToCloudinary = async(imageData: string): Promise<any>=>{

    try{
    const uploadResult = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${imageData}`,{public_id: "images"}
    )

        return uploadResult;
    }catch(error){

        console.error(error)
    }
}

export const uploadDocxToCloudinary = async(docsData: any, ): Promise<any>=>{

    try{
        const {docxPath, taskId} =  docsData
     
    const uploadResult = await cloudinary.uploader.upload(
       docxPath,{folder: "docs", resource_type: "raw"})

    fs.removeSync(docxPath)
   
    
    fs.removeSync(path.join(__dirname, "..", `uploads/${taskId}.pdf` ) )

    return (uploadResult);
    }
    catch(err){
        console.error(err)
        return err
    }
}

