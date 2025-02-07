import exp from "constants";
import { ConnectToRabbitMQ } from "../../src/config/rabbitmq";
import { processImageUpload, consumeImageUploadQueue } from "../../src/workers/imageUploadWorker";
import amqp from 'amqplib';

jest.mock("../../src/config/rabbitmq")

jest.mock("amqplib");
jest.mock("../../src/workers/imageUploadWorker");
jest.spyOn(require("../../src/workers/imageUploadWorker"), "consumeImageUploadQueue");

describe("Test for Image Upload Worker", ()=>{
        let channelMock: any
        let connectionMock: any

    beforeEach(async()=>{
        jest.clearAllMocks();
      

        channelMock = {
            assertQueue: jest.fn().mockResolvedValue(undefined),
            consume: jest.fn().mockResolvedValue(undefined),
            ack: jest.fn().mockResolvedValue(undefined),
        };

        connectionMock ={
            createChannel: jest.fn().mockResolvedValue(channelMock),
            
        };

     
        (amqp.connect as jest.Mock).mockResolvedValue(connectionMock);

       console.log('Connection and channel mocks are properly set up.');
        
        await ConnectToRabbitMQ()

    })

    it("should consume the Image Upload Queue", async()=>{
        
        
        (processImageUpload as jest.Mock).mockImplementation(jest.fn().mockResolvedValue(undefined))


        await consumeImageUploadQueue()
        

        expect(connectionMock.createChannel).toHaveReturnedTimes(1)
      
        //expect(channelMock.assertQueue).toHaveBeenCalledWith("imageUploadQueue", {durable: true})  

    })

})