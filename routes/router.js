let express = require('express');
let router = express.Router();
let IndexController = require('./index');
let PostsController = require('./api/post');

router
    .route('/')
    .get((req, res, next) => IndexController('index', req, res, next));

router
    .route('/api/post')
    .post(PostsController);

module.exports = router;
