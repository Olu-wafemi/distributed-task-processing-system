import request from "supertest";
import express, {Request, Response, NextFunction} from "express";
import { uploadImageController, PdfToWordController } from "../../src/controllers/taskController";
import { addImageUploadTask , addPdfConversionTask} from "../../src/services/taskService";
import { generateTaskId } from "../../src/utils/generateId";
import fs from "fs-extra"
import multer from "multer"
import { error } from "console";
jest.mock( "../../src/services/taskService");
jest.mock("../../src/utils/generateId")
const upload = multer()
jest.mock("fs")

const app = express()
app.use(express.json())
app.post("/api/upload-image", upload.single("file"),  uploadImageController)
app.post("/api/convert-pdf-to-word", upload.single('pdf'), PdfToWordController)
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

    it("should return 400 if no pdf file is uploaded", async()=>{
        const response = await request(app).post("/api/convert-pdf-to-word").send({})
        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: "No PDF file detected"})

    })
    it("should return 202 if Pdf was uploaded", async()=>{

        (generateTaskId as jest.Mock).mockReturnValue("123456hgs");
        (addPdfConversionTask as jest.Mock).mockResolvedValue(undefined);
        
        const response = await request(app)
          .post("/api/convert-pdf-to-word")
          .attach('pdf', Buffer.from("fake-data"), 'file.pdf');
        
        expect(response.status).toBe(202);
        expect(response.body).toEqual({message: "Task Queued", taskId: "123456hgs"});
    })
})