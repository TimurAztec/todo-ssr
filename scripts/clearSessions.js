const mongo = require('mongodb');
const moment = require('moment');
const MongoClient = mongo.MongoClient;

async function clearSessions() {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        let collection = await client.db("todo").collection("sessions");
        await collection.deleteMany({expires: {$lt: moment().toISOString()}});
        await client.close();
    } catch (e) {
        console.error(e);
    }

}

async function clearOfflineUsers() {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    let collection = await client.db("todo").collection("sessions");
    await collection.updateMany({}, {$set: {online: false}});
    await client.close();
}

module.exports = {clearSessions, clearOfflineUsers};