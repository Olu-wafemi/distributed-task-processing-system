import {Request, Response, NextFunction} from "express"
import {publishTask } from "../config/rabbitmq"
import { prisma} from "../config/db"



const TaskController = async(req: Request, res: Response, next: NextFunction)=>{

    try{
        const {type} = req.body;
        if(!type){
            return res.status(400).json({error: "Task type is required"});
        }

        const newTask = await prisma.task.create({
            data: {type},
        })

        await publishTask ({id: newTask.id, type: newTask.type});

        return res.status(201).json({message: "Task Submitted", taskId: newTask.id});

    }catch (error){
        console.error("Error submiting task:", error);
        res.status(500).json({error: "Internal server error"})
        next(error);
    }



};

export {TaskController}

