const mongo = require('mongodb');
const moment = require('moment');
const MongoClient = mongo.MongoClient;

function SocketsHandler(webSocketServer) {
    try {
        webSocketServer.on('connection', (client, request) => {
            const cookies = {};
            if(request.headers.cookie) request.headers.cookie.split(';').forEach(function(cookie)
            {
                const parts = cookie.match(/(.*?)=(.*)$/);
                const name = parts[1].trim();
                const value = (parts[2] || '').trim();
                cookies[ name ] = value;
            });

            client.on('message', (data) => {
                if (data === 'online-update' && cookies['sessionId']) {
                    onlineUpdate(cookies['sessionId']).then((onlineUsers) => {
                        client.send(JSON.stringify(onlineUsers));
                    });
                }
            })
        });
    } catch (e) {
        console.error(e);
    }
}

async function onlineUpdate(sessionId) {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    let collection = await client.db("todo").collection("sessions");
    await collection.updateOne({_id: new mongo.ObjectID(sessionId)}, {$set: {online: true}});
    const onlineSessions = await collection.find({online: true, _id: {$ne: new mongo.ObjectID(sessionId)}, expires: { $gte: moment().toISOString()}}).toArray();
    collection = await client.db("todo").collection("users");
    let users = [];
    for (let i = 0 ; i < onlineSessions.length ; i++) {
        let user = await collection.findOne({_id: mongo.ObjectID(onlineSessions[i].userId)});
        if (user) {
            users.push({_id: String(user._id), login: user.login, info: user.info});
        }
    }
    await client.close();
    return users;
}

module.exports = SocketsHandler;