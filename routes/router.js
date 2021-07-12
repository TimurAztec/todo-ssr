let express = require('express');
let router = express.Router();
let IndexController = require('./index');
let EditController = require('./edit');
let TodosController = require('./api/todo');
const AuthSignUpAPIController = require("./api/signup");
const AuthSignInAPIController = require("./api/signin");
const AuthSignOutAPIController = require("./api/signout");
const SessionHandler = require("../scripts/sessionHandler");
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

let apiRouter = express.Router({mergeParams: true});
let todoRouter = express.Router({mergeParams: true});
let authRouter = express.Router({mergeParams: true});
apiRouter.use('/todo', todoRouter);
apiRouter.use('/auth', authRouter);
router.use('/api', apiRouter);

todoRouter
    .route('/')
    .post(SessionHandler, upload.none(), TodosController);

todoRouter
    .route('/delete')
    .post(SessionHandler, upload.none(), TodosController);

todoRouter
    .route('/update')
    .post(SessionHandler, upload.none(), TodosController);

authRouter
    .route('/signup')
    .post(upload.none(), AuthSignUpAPIController);

authRouter
    .route('/signin')
    .post(upload.none(),AuthSignInAPIController);

authRouter
    .route('/signout')
    .post(upload.none(), AuthSignOutAPIController);

module.exports = router;
