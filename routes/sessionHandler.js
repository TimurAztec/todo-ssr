const mongo = require('mongodb');
const moment = require('moment');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";
let AuthController = require('./auth');

async function SessionHandler(req, res, next) {
    if (!req.cookies || !Object.values(req.cookies).length || !req.cookies.sessionId) {
        await AuthController(req, res, next);
        return;
    }

    try {
        const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
        await client.connect(err => {
            let collection = client.db("todo").collection("sessions");

            collection.findOne({_id: new mongo.ObjectID(req.cookies.sessionId)}).then((session) => {
                if (!session) {
                    res.redirect('/auth');
                    throw 'Session not found!';
                }

                if (moment(session.expires) < moment()) {
                    collection.deleteOne({_id: session._id});
                    res.clearCookie('sessionId');
                    res.redirect('/auth');
                    throw 'Session expired!';
                }

                req.session = session;
                next();
            });
        });
    } catch (e) {
        console.error(e);
    }
}

module.exports = SessionHandler;