import express, { Request, Response } from "express";
import { testDbConnection } from "./src/config/db";
import dotenv from "dotenv";


import {router} from "./src/routes/task"
dotenv.config()


testDbConnection();

const app = express()

app.use("/task", router);

const PORT = process.env.PORT || 6000

app.use(express.json());

app.get('/', (_req: Request , res: Response) =>{

    res.send("Service is running")
})

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
})