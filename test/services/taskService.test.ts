import { channel } from "diagnostics_channel";
import { addImageUploadTask, addPdfConversionTask } from "../../src/services/taskService";


import amqp from 'amqplib';


jest.mock('amqplib');

describe('Task Queueing Serice', ()=>{

    let channelMock: any;
    let connectionMock: any;

    beforeAll(async ()=> {
        channelMock = {
            assertQueue: jest.fn(),
            sendToQueue: jest.fn(),
        }
    })

    connectionMock = {
        createChannel: jest.fn().mockResolvedValue(channelMock),
        close: jest.fn(),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(connectionMock);

it("should add an image upload task to the queue", async () =>{
    await addImageUploadTask({imageData: "fakeBase64Image", taskId: "1234"})

    expect(channelMock.assertQueue).toHaveBeenCalledWith('image_upload_queue',{durable: true})
    
})

})
