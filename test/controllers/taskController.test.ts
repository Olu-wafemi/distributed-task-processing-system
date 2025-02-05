import request from "supertest";
import express, {Request, Response, NextFunction} from "express";
import { uploadImageController } from "../../src/controllers/taskController";
import { addImageUploadTask } from "../../src/services/taskService";
import { generateTaskId } from "../../src/utils/generateId";
import multer from "multer"
jest.mock( "../../src/services/taskService");
jest.mock("../../src/utils/generateId")
const upload = multer()

const app = express()
app.use(express.json())
app.post("/api/upload-image", upload.single("file"),  uploadImageController)

describe("Upload Image and Pdf Task Controller", ()=>{
    it("should return 400 if no image is uploaded", async() =>{
        const response = await request(app).post("/api/upload-image").send({})


        expect(response.status).toBe(400);
        expect(response.body).toEqual({status:false, message: "No image detected"})


    })
    it("should return 201 if image is upoloaded", async()=>{

        (addImageUploadTask as jest.Mock).mockResolvedValue(undefined);
        (generateTaskId as jest.Mock).mockReturnValue("mockedTaskId123")

        const response = await request(app).post("/api/upload-image").attach('file', Buffer.from("fake-image-data"), "image.jpg",);

        expect(response.status).toBe(201);
        expect(response.body).toEqual({message: "Task Queued", taskId: "mockedTaskId123"})



    })
})