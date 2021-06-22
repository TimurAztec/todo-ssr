let express = require('express');
let router = express.Router();
let IndexController = require('./index');
let EditController = require('./edit');
let TodosController = require('./api/todo');

router
    .route('/')
    .get((req, res, next) => IndexController('index', req, res, next));

router
    .route('/edit/:todoid')
    .get((req, res, next) => EditController('edit', req, res, next));

router
    .route('/api/todo')
    .all(TodosController);

module.exports = router;
