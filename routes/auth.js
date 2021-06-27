async function AuthController(req, res, next) {
    this.pageRoute = 'auth';
    this.pageData = {
        title: 'Auth'
    };

    res.render(this.pageRoute, this.pageData);
}

module.exports = AuthController;