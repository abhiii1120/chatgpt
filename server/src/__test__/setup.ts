import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from "mongoose";

let mongoServer : MongoMemoryServer;

/**
 * Spins up a temporary, in-memory mongodb instance and connects mongoose to it.
 * we call this before any test run.
 */
export async function connectTestDB(){
    //create and start a fresh in-memory instance
    mongoServer = await MongoMemoryServer.create();

    //get the connection string for the in-memory instance
    const uri = mongoServer.getUri();

    //connect mongoose to the in-memory instance
    await mongoose.connect(uri);
}

/**
 * Disconnects mongoose and stops in-memory mongoDb instance.
 */
export async function disconnectTestDB(){
    //Close the mongoose connection
    await mongoose.disconnect();

    // shut down the in-memory mongo server
    await mongoServer.stop();
}

/**
 * Deletes all documents from every collection in the current connection.
 */
export async function clearTestDB(){
    const collections = mongoose.connection.collections;

    // loop through every registered collection and empty it
    for(let key in collections){
        await collections[key]?.deleteMany({});
    }
}


// for running particular file then using -- and file name will work
// npm run test -- auth.register

//for running one specific test use -t : -t stands for test name
// npm run test -- -t "should register the user"

// for running one specific test from one file use this command
// npm run test -- auth.register -t "should register the user"

