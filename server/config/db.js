const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://mathews:Rihanna6927@cluster0.16sij.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;

async function connectToDb() {
    if (!client) {
        try {
            client = new MongoClient(uri);
            await client.connect();
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error.message);
            throw new Error('Failed to connect to MongoDB');
        }
    }
    return client.db('FitnessSocialMediaApp');
}


module.exports = { connectToDb };


