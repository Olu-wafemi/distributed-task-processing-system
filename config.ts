import * as dotenv from "dotenv";


dotenv.config()

const config = {
    rabbitmqUrl: process.env.RABBITMQ_URL,
    cloudName: process.env.CLOUD_NAME,
    apiKey: process.env.API_KEY,
    apiSecret: process.env.API_SECRET,
    secretKey: process.env.SECRET_KEY


}

export {config}