const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const uri = "mongodb+srv://common_user:usage@shash.fmuxn.mongodb.net/shashin?retryWrites=true&w=majority";

async function AuthController(req, res, next) {
    this.pageRoute = 'auth';
    this.pageData = {
        title: 'Auth'
    };

    res.render(this.pageRoute, this.pageData);
}

module.exports = AuthController;