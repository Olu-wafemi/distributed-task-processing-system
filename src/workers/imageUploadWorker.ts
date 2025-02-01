
import { prisma } from "../config/db";
import { ConnectToRabbitMQ, getRabbitMQChannel } from "../config/rabbitmq";
import { uploadImageToCloudinary } from '../services/cloudinary';


const channel = getRabbitMQChannel()

const processImageUpload = async (taskData: any) =>{
    const {imageData,taskId} = taskData;
    try{
        const uploadedImage = await uploadImageToCloudinary(imageData);

        await prisma.task.create({
            data: {
                taskId: taskId,
                filePath: uploadedImage.url,
                status: "completed"
                
            }
        })
    }
    catch(error){
        console.log(`Image upload task`)
    }
}

const consumeImageUploadQueue = async() =>{
    channel.consume('imageUploadQueue', async (msg: any)=>{
        const taskData = JSON.parse(msg)
        await processImageUpload(taskData)
        channel.ack(msg)

    })
}

ConnectToRabbitMQ();
consumeImageUploadQueue();