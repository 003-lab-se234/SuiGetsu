const router = require('express').Router()
const { default: axios } = require('axios');
const config = require('../config/config');
const authController = require('../controllers/auth.controller');
const { log } = require('../middleware');
const { authentication, secureRoute } = require('../middleware/auth');
const { User } = require('../models/User');
const logger = require('../utilities/logger');
const staffRouter = require('./staff.router');

router.use(log)
router.get('/', async (req, res) => {
    let user = {};
    try {
        const id = req.session.userId;
        user = await User.findById(id);
        // console.log(user)
    } catch (err) {
        logger.error(err);
    }
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.render('index.ejs', {
        title: "Hello Human",
        user
    })
})


router.get('/about', async (req, res) => {
    let user = {};
    try {
        const id = req.session.userId;
        user = await User.findById(id);
    } catch (err) {
        logger.error(err);
    }
    res.status(200);
    res.setHeader('content-type', 'text/html');
    res.render('publicPages/about.ejs', { user });
    // res.sendFile(path.join(__dirname, '..', '..', 'public','html', 'about.html'))

})

router.get('/contact', async(req, res) => {
    let user = {} ;
    try {
        const id = req.session.userId ;
        user = await User.findById(id);
        // console.log(user)
    } catch (err) {
        logger.error(err);
    }
    res.status(200);
    res.setHeader('content-type', 'text/html');
    res.render('publicPages/contact.ejs', {user});
    // res.sendFile(path.join(__dirname, '..', '..', 'public','html', 'contact.html'));
})

router.get('/menu', (req, res) => {
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.send("To be continued");
})

router.use('/staff', secureRoute ,staffRouter);
// router.use('/user', authentication , userRouter);
router.use('/auth', authController);

router.get('/status', (req, res) => {
    res.status(200);
    res.render('publicPages/health.ejs', { health: config.getConfig() })
    // res.json(config.printOut())
})

router.use('/test/error', (req, res) => {
    try {
        throw new Error("Hi this is test error.")
        res.send(200);
    } catch (err) {
        res.status(500);
        res.render('publicPages/error.ejs', { error: err })
    }
})

router.use('*', (req, res) => {
    res.render('publicPages/404.ejs')
})

module.exports = router;