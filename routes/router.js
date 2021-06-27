let express = require('express');
let router = express.Router();
let IndexController = require('./index');
let EditController = require('./edit');
let TodosController = require('./api/todo');
const AuthSignUpAPIController = require("./api/signup");
const AuthSignInAPIController = require("./api/signin");
const AuthSignOutAPIController = require("./api/signout");

router
    .route('/')
    .get((req, res, next) => IndexController(req, res, next));

router
    .route('/edit/:todoid')
    .get((req, res, next) => EditController(req, res, next));

router
    .route('/api/todo')
    .all(TodosController);

router
    .route('/api/auth/signup')
    .all(AuthSignUpAPIController);

router
    .route('/api/auth/signin')
    .all(AuthSignInAPIController);

router
    .route('/api/auth/signout')
    .all(AuthSignOutAPIController);

module.exports = router;
