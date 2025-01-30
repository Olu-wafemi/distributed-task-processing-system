import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const testDbConnection = async () => {

    try{

        await prisma.$connect();
        console.log("Connection Successful");
    }

    catch(error){
        console.error('Database connection error:', error);
        process.exit(1);

    }
}

export {prisma, testDbConnection}