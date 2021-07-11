const mongo = require('mongodb');
const moment = require('moment');
const MongoClient = mongo.MongoClient;

async function getUsersOnline() {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        let collection = await client.db("todo").collection("sessions");
        let sessions = await collection.find({expires: { $gte: moment().toISOString()}}).toArray();
        collection = await client.db("todo").collection("users");
        let users = [];
        for (let i = 0 ; i < sessions.length ; i++) {
            let user = await collection.findOne({_id: mongo.ObjectID(sessions[i].userId)});
            if (user) {
                users.push({_id: String(user._id), login: user.login, info: user.info});
            }
        }
        await client.close();
        return users;
    } catch (e) {
        console.error(e);
    }

}

module.exports = {getUsersOnline};