let express = require('express');
let router = express.Router();
let IndexController = require('./index');

router
    .route('/')
    .get((req, res, next) => IndexController('index').render(req, res, next));

module.exports = router;
