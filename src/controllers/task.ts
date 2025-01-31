import {Request, Response, NextFunction} from "express"
import {publishTask } from "../config/rabbitmq"
import { prisma} from "../config/db"


interface TaskBody{
    type :string;
}


const TaskController = async(req: Request, res: Response, next: NextFunction): Promise<void> =>{

    try{
        const {type} = req.body as TaskBody;
        if(!type){
            res.status(400).json({error: "Task type is required"});
        }

        const newTask = await prisma.task.create({
            data: {type},
        })

        await publishTask ({id: newTask.id, type: newTask.type});

        res.status(201).json({message: "Task Submitted", taskId: newTask.id});

    }catch (error){
        console.error("Error submiting task:", error);
        res.status(500).json({error: "Internal server error"})
        next(error);
    }



};

export {TaskController}

