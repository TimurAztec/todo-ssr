const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const crypto = require('crypto');

async function SessionAPIController(req, res, next) {
    const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    if (req.method === 'POST') {
        await client.connect(err => {
            const collection = client.db("todo").collection("users");
            collection.insertOne({
                login: req.body.login,
                password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
                info: req.body.info
            }).then((dbres) => {
                res.send(dbres);
                client.close();
            });
        });
    }
}

module.exports = SessionAPIController;