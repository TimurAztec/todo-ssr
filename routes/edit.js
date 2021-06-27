const mongo = require('mongodb');
const AuthController = require("./auth");
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function EditController(req, res, next) {
    this.pageRoute = 'edit';
    this.pageData = {
        title: 'TODO edit'
    };

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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

                const collection = client.db("todo").collection("todos");
                collection.findOne({_id: new mongo.ObjectID(req.params.todoid)}).then((dbres) => {
                    this.pageData.item = dbres;
                    res.render(this.pageRoute, this.pageData);

                    client.close();
                });
            });
        });
    } catch (e) {
        console.error(e);
    }
}

module.exports = EditController;