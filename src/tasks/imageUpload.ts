import { task } from '@prisma/client';
import {prisma } from '../config/db';

import fs from 'fs';
import path from 'path';

export const handleImageUploadTask = async (task: task) =>{
    try{
        const imagePath = task.filePath;
        
        await prisma.task.update({
            where: {id: task.id},
            data: {status: 'completeted'}

        });

    }

    catch(err){
        await prisma.task.update({
            where: {id: task.id},
            data: {status: "Failed"},
        })
    }
}