import amqp from "amqplib";

const RABBITMQ_URL: string = "amqp://localhost";

let channel: amqp.channel;

const ConnectToRabbitMQ = async ()=>{
    try{
        const connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        await channel.assertQueue('task_queue', {durbale: true});
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

