import express, { Request, Response, NextFunction } from "express";
import { testDbConnection } from "./src/config/db";
import dotenv from "dotenv";
import multer from "multer";
import taskRoutes from "./src/routes/taskRoutes"
import { ConnectToRabbitMQ } from "./src/config/rabbitmq";
import bodyParser from "body-parser";
//import { consumeImageUploadQueue } from "./src/workers/imageUploadWorker";

dotenv.config()


async function initializeApp() {
    try {
   
        await ConnectToRabbitMQ();
    
        await testDbConnection();

        
    
        const app = express()
        
           
        app.use(bodyParser.urlencoded({ extended: false }))
        app.use(express.json())
        app.use(express.urlencoded())

        const upload = multer()
        
       
        app.post('/api/upload-image', upload.single('file'), 
            async (req: Request, res: Response, next: NextFunction) => {
                
            }
        )

        app.use("/api", taskRoutes)

      
        app.get('/', (_req: Request, res: Response) => {
            res.send("Service is running")
        })

        
        const PORT = process.env.PORT || 6000
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })

        return app
    } catch (error) {
        console.error('Failed to initialize application:', error)
        process.exit(1)
    }
}


initializeApp()