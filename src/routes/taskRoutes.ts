import  {uploadImageController, PdfToWordController} from "../controllers/taskController"
import { Router  } from "express";

const router = Router();

router.post("/upload-image", uploadImageController);

router.post("/convert-pdf-to-word", PdfToWordController);
export default router;
