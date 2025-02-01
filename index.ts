import express, { Request, Response } from "express";
import { testDbConnection } from "./src/config/db";
import dotenv from "dotenv";

import multer from "multer";

import taskRoutes from "./src/routes/taskRoutes"
import { ConnectToRabbitMQ } from "./src/config/rabbitmq";
dotenv.config()


testDbConnection();
ConnectToRabbitMQ();

const app = express()
app.use(express.json());
const upload = multer();

app.use("/api", taskRoutes);

app.post('/api/upload-image', upload.single('file'), (req: Request,res: Response)=>{
    upload
})

const PORT = process.env.PORT || 6000

app.use(express.json());

app.get('/', (_req: Request , res: Response) =>{

    res.send("Service is running")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})