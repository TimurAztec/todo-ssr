const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function TodosController(req, res, next) {
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});
    await client.connect(err => {
        let collection;
        if (req.method === 'POST') {
            collection = client.db("todo").collection("users");
            collection.findOne({_id: new mongo.ObjectID(req.session.userId)}).then((user) => {
                if (user) {
                    collection = client.db("todo").collection("todos");
                    collection.insertOne({value: req.body.value, userId: String(user._id)}).then((todo) => {
                        res.send(todo);
                        client.close();
                    });
                } else {
                    res.send('User not found!');
                }
            });
        }
        if (req.method === 'DELETE') {
            collection = client.db("todo").collection("todos");
            collection.deleteOne({_id: new mongo.ObjectID(req.body.id)}).then((dbres) => {
                res.send(dbres);
                client.close();
            });
        }
        if (req.method === 'PUT') {
            collection = client.db("todo").collection("todos");
            collection.updateOne(
                {_id: new mongo.ObjectID(req.body.id)},
                {$set: {value: req.body.value}},
            ).then((dbres) => {
                res.send(dbres);
                client.close();
            });
        }
    });
}

module.exports = TodosController;