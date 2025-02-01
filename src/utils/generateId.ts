import {v4 as uuidv4} from 'uuid';

export const generateTaskId = (): string =>{
    return uuidv4();
}