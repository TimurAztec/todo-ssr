const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const crypto = require('crypto');
const moment = require('moment');
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function AuthSignUpAPIController(req, res, next) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    if (req.method === 'POST') {
        await client.connect(err => {
            let collection = client.db("todo").collection("users");
            collection.findOne({login: req.body.login}).then((userexist) => {
                if (userexist) {
                    res.send('Such user already exist!')
                } else {
                    collection.insertOne({
                        login: req.body.login,
                        password: crypto.createHash('sha256').update(req.body.password).digest('hex'),
                        info: req.body.info
                    }).then((user) => {
                        collection = client.db("todo").collection("sessions");
                        collection.insertOne({
                            exp: moment().add(10, 'minutes').toISOString(),
                            userId: String(user.ops[0]._id)
                        }).then((session) => {
                            res.cookie('sessionId', String(session.ops[0]._id), {
                                httpOnly: true,
                                expires: moment().add(10, 'minutes').toDate()
                            });
                            res.send(session);
                            client.close();
                        });
                    });
                }
            });
        });
    }
}

module.exports = AuthSignUpAPIController;