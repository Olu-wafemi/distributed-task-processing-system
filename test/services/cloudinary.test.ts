import { uploadImageToCloudinary } from "../../src/services/cloudinary";

import { uploadDocxToCloudinary } from "../../src/services/cloudinary";
import { v2 as cloudinary } from 'cloudinary';

import fs from "fs-extra"

jest.mock("fs")
jest.mock("cloudinary")
describe("Image and Pdf Upload to Cloudinary", ()=>{

    const mockUpload = cloudinary.uploader.upload as jest.Mock;

    it("should upload image to Cloudinary", async()=>{

        const mockResponse = { url: "https://mocked.cloudinary.com/image.jpg" };
        mockUpload.mockResolvedValue(mockResponse);


        const fakeImageData =  "Thisisafakeimagedataasbase64"
        const functioncall = await uploadImageToCloudinary(fakeImageData);
        expect(mockUpload).toHaveBeenCalledWith(`data:image/jpeg;base64,${fakeImageData}`, { public_id: "images" });
        
        expect(functioncall).toMatchObject(mockResponse)


    })

    it("should upload Doc file to Cloudinary", async()=>{

        const mockResponse = {url: "https://mockedurl.com"}

        mockUpload.mockResolvedValue(mockResponse);

        const docsData = {docxPath: "testPath", taskId: "testId"}

        const functioncall = await uploadDocxToCloudinary(docsData)
      
        expect(functioncall).toMatchObject(mockResponse)

    })



})