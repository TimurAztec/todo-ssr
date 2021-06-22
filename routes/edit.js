const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function EditController(pageRoute, req, res, next) {
    this.pageRoute = pageRoute || '';
    this.pageData = {
        title: 'TODO edit'
    };

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect(err => {
        const collection = client.db("todo").collection("todos");
        collection.findOne({_id: new mongo.ObjectID(req.params.todoid)}).then((dbres) => {
            this.pageData.item = dbres;
            console.log(this.pageData.item);
            res.render(this.pageRoute, this.pageData);

            client.close();
        });
    });

}

module.exports = EditController;