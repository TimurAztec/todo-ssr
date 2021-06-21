const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function PostController(req, res, next) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(req.body);
    await client.connect(err => {
        const collection = client.db("shashin").collection("posts");
        collection.insertOne({name: req.body.name}).then((dbres) => {
            res.send(dbres);
            client.close();
        });
    });
}

module.exports = PostController;