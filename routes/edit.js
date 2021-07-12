const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

async function EditController(req, res, next) {
    this.pageRoute = 'edit';
    this.pageData = {
        title: 'TODO edit'
    };

    const client = new MongoClient(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

    try {
        await client.connect();
        const collection = await client.db("todo").collection("todos");
        let item = await collection.findOne({_id: new mongo.ObjectID(req.params.todoid)});
        this.pageData.item = item;
        await res.render(this.pageRoute, this.pageData);

        await client.close();
    } catch (e) {
        console.error(e);
    }
}

module.exports = EditController;