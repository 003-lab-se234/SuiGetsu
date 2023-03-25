const router = require('express').Router()
const authController = require('../controllers/auth.controller');
const { log } = require('../middleware');
const { authentication, secureRoute } = require('../middleware/auth');

router.use(log)
router.get('/', (req, res) => {
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.render('index.ejs', {
        title: "Hello Human"
    })
})

router.use('/auth', authController);

router.get('/customer', authentication, (req, res) => {
    res.send("This is customer route ")
})

router.get('/staff', secureRoute, (req, res) => {
    res.send("This is staff route")
})

module.exports = router;