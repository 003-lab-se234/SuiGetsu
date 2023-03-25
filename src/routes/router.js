const router = require('express').Router()
const authController = require('../controllers/auth.controller');
const { log } = require('../middleware');

router.use(log)
router.get('/', (req, res) => {
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.render('index.ejs', {
        title: "Hello Human"
    })
})

router.use('/auth', authController);
// router.use('/')

module.exports = router;