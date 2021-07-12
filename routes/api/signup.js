const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const crypto = require('crypto');
const moment = require('moment');

async function AuthSignUpAPIController(req, res, next) {
    const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
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
                            expires: moment().add(10, 'minutes').toISOString(),
                            userId: String(user.ops[0]._id),
                            online: false
                        }).then((session) => {
                            res.cookie('sessionId', String(session.ops[0]._id), {
                                httpOnly: true,
                                expires: moment().add(10, 'minutes').toDate()
                            });
                            res.redirect('/');
                            client.close();
                        });
                    });
                }
            });
        });
    }
}

module.exports = AuthSignUpAPIController;