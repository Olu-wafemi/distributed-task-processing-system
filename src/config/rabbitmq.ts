import amqp from "amqplib";
import dotenv from "dotenv"


const RABBITMQ_URL:any = process.env.RABBITMQ_URL;

let channel: amqp.Channel;

const ConnectToRabbitMQ = async ()=>{
    try{
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('task_queue', {durable: true});
        console.log("Connected to RabbitMQ")
        }
        catch(error){
            console.error("RabbitMQ connection error", error);
        }

}

const publishTask = async (task: {id: string, type: string}) =>{
    if(!channel){
        throw new Error('RabbitMQ channel is not initialiazed')
    }

    channel.sendToQueue('task_queue', Buffer.from(JSON.stringify(task)),{
        persistent: true,
    })

    console.log(`Task [${task.id}] sent to queue`);
}

export { ConnectToRabbitMQ, publishTask}

