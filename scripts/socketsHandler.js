const mongo = require('mongodb');
const moment = require('moment');
const MongoClient = mongo.MongoClient;

function SocketsHandler(webSocketServer) {
    try {
        webSocketServer.on('connection', (client, request) => {
            const cookies = {};
            if (request.headers.cookie) request.headers.cookie.split(';').forEach(function (cookie) {
                const parts = cookie.match(/(.*?)=(.*)$/);
                const name = parts[1].trim();
                const value = (parts[2] || '').trim();
                cookies[name] = value;
            });

            getUser(cookies['sessionId']).then((user) => {
                client.userId = String(user._id);
            });

            client.on('message', (data) => {
                try {
                    let res = JSON.parse(data);
                    if (res.action === 'onlineUpdate' && cookies['sessionId']) {
                        onlineUpdate(cookies['sessionId']).then((onlineUsers) => {
                            client.send(JSON.stringify({action: 'onlineUpdate', onlineUsers}));
                        });
                    }
                    if (res.action === 'startChat' && cookies['sessionId']) {
                        getChat(cookies['sessionId'], res.uid).then((chatStory) => {
                            client.send(JSON.stringify({action: 'sendChat', chatStory}));
                        });
                    }
                    if (res.action === 'sendChat' && cookies['sessionId']) {
                        sendChat(cookies['sessionId'], res.uid, res.text).then((chatStory) => {
                            client.send(JSON.stringify({action: 'sendChat', chatStory}));
                            webSocketServer.clients.forEach((tclient) => {
                                if (tclient.userId === res.uid) {
                                    tclient.send(JSON.stringify({action: 'sendChat', chatStory}));
                                }
                            });
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
            })
        });
    } catch (e) {
        console.error(e);
    }
}

async function getUser(sessionId) {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    let collection = await client.db("todo").collection("sessions");
    let session = await collection.findOne({_id: new mongo.ObjectID(sessionId)});
    collection = await client.db("todo").collection("users");
    let user = await collection.findOne({_id: new mongo.ObjectID(session.userId)});
    await client.close();
    return user;
}

async function onlineUpdate(sessionId) {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    let collection = await client.db("todo").collection("sessions");
    await collection.updateOne({_id: new mongo.ObjectID(sessionId)}, {$set: {online: true}});
    const onlineSessions = await collection.find({
        online: true,
        _id: {$ne: new mongo.ObjectID(sessionId)},
        expires: {$gte: moment().toISOString()}
    }).toArray();
    collection = await client.db("todo").collection("users");
    let users = [];
    for (let i = 0; i < onlineSessions.length; i++) {
        let user = await collection.findOne({_id: mongo.ObjectID(onlineSessions[i].userId)});
        if (user) {
            users.push({_id: String(user._id), login: user.login, info: user.info});
        }
    }
    await client.close();
    return users;
}

async function getChat(sessionId, targetUserId) {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    let collection = await client.db("todo").collection("sessions");
    let session = await collection.findOne({_id: new mongo.ObjectID(sessionId)});
    collection = await client.db("todo").collection("users");
    let user = await collection.findOne({_id: new mongo.ObjectID(session.userId)});
    collection = await client.db("todo").collection("chats");
    let chat = await collection.findOne({users: {$all: [String(user._id), targetUserId]}});
    if (chat) {
        await client.close();
        return chat.messages;
    } else {
        chat = await collection.insertOne({
            messages: [],
            users: [String(user._id), targetUserId]
        });
        await client.close();
        return chat.messages;
    }
}

async function sendChat(sessionId, targetUserId, text) {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect();
    let collection = await client.db("todo").collection("sessions");
    let session = await collection.findOne({_id: new mongo.ObjectID(sessionId)});
    collection = await client.db("todo").collection("users");
    let user = await collection.findOne({_id: new mongo.ObjectID(session.userId)});
    collection = await client.db("todo").collection("chats");
    let chat = await collection.findOne({users: {$all: [String(user._id), targetUserId]}});
    if (chat) {
        await collection.updateOne({_id: chat._id}, {
            $push: {
                messages: {sender: String(user._id), text: text}
            }
        });
        chat = await collection.findOne({_id: chat._id});
        await client.close();
        return chat.messages;
    } else {
        chat = await collection.insertOne({
            messages: [],
            users: [String(user._id), targetUserId]
        });
        await collection.updateOne({_id: chat._id}, {
            $push: {
                messages: {sender: String(user._id), text: text}
            }
        });
        chat = await collection.findOne({_id: chat._id});
        await client.close();
        return chat.messages;
    }
}

module.exports = SocketsHandler;