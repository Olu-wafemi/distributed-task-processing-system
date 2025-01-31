import  {TaskController} from "../controllers/task"
import { Router  } from "express";

const router = Router();

router.post("/", TaskController);

export {router}; 