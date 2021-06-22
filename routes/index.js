const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function IndexController(pageRoute, req, res, next) {
    this.pageRoute = pageRoute || '';
    this.pageData = {
        title: 'TODO list'
    };

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(err => {
        const collection = client.db("todo").collection("todos");
        collection.find({}).toArray().then((dbres) => {
            this.pageData.list = dbres;
            res.render(this.pageRoute, this.pageData);

            client.close();
        });
    });

}

module.exports = IndexController;
