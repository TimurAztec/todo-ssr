function IndexController(pageRoute) {
    this.pageRoute = pageRoute || '';
    this.pageData = {
        title: 'index'
    };

    return {
        render: (req, res, next) => { res.render(this.pageRoute, this.pageData) }
    }
}

module.exports = IndexController;
