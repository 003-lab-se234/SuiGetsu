const router = require('express').Router()
const { default: axios } = require('axios');
const config = require('../config/config');
const authController = require('../controllers/auth.controller');
const { log } = require('../middleware');
const { authentication, secureRoute } = require('../middleware/auth');
const { Food } = require('../models/Food');
const { User } = require('../models/User');
const logger = require('../utilities/logger');
const { paginate } = require('../utilities/paginate');
const staffRouter = require('./staff.router');
const userRouter = require('./user.router');

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

router.get('/contact', async (req, res) => {
    let user = {};
    try {
        const id = req.session.userId;
        user = await User.findById(id);
        // console.log(user)
    } catch (err) {
        logger.error(err);
    }
    res.status(200);
    res.setHeader('content-type', 'text/html');
    res.render('publicPages/contact.ejs', { user });
    // res.sendFile(path.join(__dirname, '..', '..', 'public','html', 'contact.html'));
})

router.get('/menu', async (req, res) => {
    try {
        let user = {};
        const id = req.session.userId;
        user = await User.findById(id);

        let { category, page, title } = req.query;
        let filter = {}
        if (!page) page = 1;
        if (category && category != "any") filter = { ...filter, category };
        if (title) filter = { ...filter, title: { $regex: new RegExp(`${title}`), $options: 'i' } };
        let sort = { is_outofstock: 1, updatedAt: 1 }
        const foods = await Food.find(filter).sort(sort);
        const paginateFood = paginate(foods, page, 6);
        res.render('publicPages/menus.ejs', { user, data: paginateFood, category, page, title });


    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

router.use('/staff', secureRoute, staffRouter);
router.use('/user', authentication , userRouter);
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