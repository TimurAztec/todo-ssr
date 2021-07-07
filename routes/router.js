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
const upload = require('multer')();

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
    .post(SessionHandler, upload.none(), TodosController);

router
    .route('/api/todo/delete')
    .post(SessionHandler, upload.none(), TodosController);

router
    .route('/api/todo/update')
    .post(SessionHandler, upload.none(), TodosController);

router
    .route('/api/auth/signup')
    .post(upload.none(), AuthSignUpAPIController);

router
    .route('/api/auth/signin')
    .post(upload.none(),AuthSignInAPIController);

router
    .route('/api/auth/signout')
    .post(upload.none(), AuthSignOutAPIController);

module.exports = router;
