const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";
let AuthController = require('./auth');

async function IndexController(req, res, next) {
    this.pageRoute = 'index';
    this.pageData = {
        title: 'TODO list'
    };
    const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});

    if (!req.cookies || !Object.values(req.cookies).length || !req.cookies.sessionId) {
        await AuthController(req, res, next);
        return;
    }

    try {
        await client.connect(err => {
            let collection = client.db("todo").collection("sessions");

            collection.findOne({_id: new mongo.ObjectID(req.cookies.sessionId)}).then((session) => {
                if (!session) {
                    AuthController(req, res, next);
                    throw 'Session not found!';
                }

                collection = client.db("todo").collection("users");
                collection.findOne({_id: mongo.ObjectID(session.userId)}).then((user) => {
                    collection = client.db("todo").collection("todos");
                    collection.find({userId: String(user._id)}).toArray().then((todos) => {
                        this.pageData.list = todos;
                        this.pageData.user = user;
                        res.render(this.pageRoute, this.pageData);

                        client.close();
                    });
                });

            });
        });
    } catch (e) {
        console.error(e);
    }

}

module.exports = IndexController;
