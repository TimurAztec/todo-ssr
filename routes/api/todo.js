const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function TodosController(req, res, next) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    if (req.method === 'POST') {
        await client.connect(err => {
            const collection = client.db("todo").collection("todos");
            collection.insertOne({value: req.body.value}).then((dbres) => {
                res.send(dbres);
                client.close();
            });
        });
    }
    if (req.method === 'DELETE') {
        await client.connect(err => {
            const collection = client.db("todo").collection("todos");
            console.log(req.body.id);
            collection.deleteOne({_id: new mongo.ObjectID(req.body.id)} ).then((dbres) => {
                res.send(dbres);
                client.close();
            });
        });
    }
    if (req.method === 'PUT') {
        await client.connect(err => {
            const collection = client.db("todo").collection("todos");
            collection.updateOne(
                {_id: new mongo.ObjectID(req.body.id)},
                {$set: {value: req.body.value}},
                ).then((dbres) => {
                res.send(dbres);
                client.close();
            });
        });
    }
}

module.exports = TodosController;