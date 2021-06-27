let express = require('express');
let router = express.Router();
let IndexController = require('./index');
let EditController = require('./edit');
let TodosController = require('./api/todo');
const AuthSignUpAPIController = require("./api/signup");
const AuthSignInAPIController = require("./api/signin");
const AuthSignOutAPIController = require("./api/signout");
const SessionHandler = require("./sessionHandler");
const AuthController = require("./auth");

router
    .route('/')
    .get(SessionHandler, IndexController);

router
    .route('/edit/:todoid')
    .get(SessionHandler, EditController);

router
    .route('/auth')
    .all(AuthController);

router
    .route('/api/todo')
    .all(SessionHandler, TodosController);

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
