import { ConnectToRabbitMQ } from "../../src/config/rabbitmq";
import { addImageUploadTask,addPdfConversionTask  } from "../../src/services/taskService";
import amqp from 'amqplib';

jest.mock('amqplib');

describe('Task Queueing Service', () => {
    let channelMock: any;
    let connectionMock: any;

    beforeAll(async () => {
       
        channelMock = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            sendToQueue: jest.fn().mockResolvedValue(undefined),
        };
        connectionMock = {
            createChannel: jest.fn().mockResolvedValue(channelMock),
            close: jest.fn(),
        };
        (amqp.connect as jest.Mock).mockResolvedValue(connectionMock);

        await ConnectToRabbitMQ()

    
        console.log('Connection and channel mocks are properly set up.');
    });
   

    it("should add an image upload task to the queue", async () => {
        const task = {type: 'image-upload', imageData: "fakeBase64Image", taskId: "1234" };

        await addImageUploadTask(task);

        
        expect(channelMock.assertQueue).toHaveBeenCalledWith('imageUploadQueue', { durable: true });

        expect(channelMock.sendToQueue).toHaveBeenCalledWith(
            'imageUploadQueue',
            Buffer.from(JSON.stringify(task))
        );
    });

    it("should add a pdf image upload task to queue", async()=>{
        const task = {type: 'pdf-to-word', tempfilepath: "fakedata", taskId: "12345" }

        await addPdfConversionTask(task)
        
        expect(channelMock.assertQueue).toHaveBeenCalledWith("pdfToWordQueue", {durable: true});

        expect(channelMock.sendToQueue).toHaveBeenCalledWith(
            "pdfToWOrdQueue", Buffer.from(JSON.stringify(task))
        );
    })
});