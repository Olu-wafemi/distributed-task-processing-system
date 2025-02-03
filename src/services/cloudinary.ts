import {v2 as cloudinary} from "cloudinary"
import { error } from "console"
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const uploadImageToCloudinary = async(imageData: string)=>{
    const uploadResult = await cloudinary.uploader.upload(
        `data:image/jpeg;base64, ${imageData}`,{public_id: "images"}


    ).catch((error)=>{
        console.log(error)
        return error
    })

        console.log(uploadResult)

    return (uploadResult);
}

export const uploadDocxToCloudinary = async(docsData: string)=>{
    const uploadResult = await cloudinary.uploader.upload(
        `data:image/pdf
        ;base64, ${docsData}`,{public_id: "Docs"}
    ).catch((error)=>{
        return error
    })

    return (uploadResult);
}