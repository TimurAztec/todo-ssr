const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function IndexController(req, res, next) {
    this.pageRoute = 'index';
    this.pageData = {
        title: 'TODO list'
    };
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect(err => {
            let collection = client.db("todo").collection("users");
            collection.findOne({_id: mongo.ObjectID(req.session.userId)}).then((user) => {
                collection = client.db("todo").collection("todos");
                collection.find({userId: String(user._id)}).toArray().then((todos) => {
                    this.pageData.list = todos;
                    this.pageData.user = user;
                    res.render(this.pageRoute, this.pageData);

                    client.close();
                });
            });
        });
    } catch (e) {
        console.error(e);
    }

}

module.exports = IndexController;
