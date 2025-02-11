import {v2 as cloudinary} from "cloudinary"
import { error } from "console"
import path from "path"

import dotenv from "dotenv"

import {  config } from "../../config"
import fs from "fs-extra"
cloudinary.config({
    cloud_name: config.rabbitmqUrl,
    api_key: config.apiKey,
    api_secret: config.apiSecret
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

   
    return (uploadResult);
    }
    catch(err){
        console.error(err)
        return err
    }
}

