const mongo = require('mongodb');
const {getUsersOnline} = require("./chat");
const MongoClient = mongo.MongoClient;

async function IndexController(req, res, next) {
    this.pageRoute = 'index';
    this.pageData = {
        title: 'TODO list'
    };
    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        let collection = await client.db("todo").collection("users");
        let user = await collection.findOne({_id: mongo.ObjectID(req.session.userId)});
        collection = await client.db("todo").collection("todos");
        let todos = await collection.find({userId: String(user._id)}).toArray();
        let users = await getUsersOnline();
        this.pageData.list = todos;
        this.pageData.user = user;
        this.pageData.chat = {
            users: users
        };
        await res.render(this.pageRoute, this.pageData);

        await client.close();
    } catch (e) {
        console.error(e);
    }

}

module.exports = IndexController;
