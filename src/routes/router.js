const router = require('express').Router()
const { log } = require('../middleware');
const staffRouter = require('./staff.router');

router.use(log);

router.get('/', (req, res) => {
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.render('index.ejs', {
        title: "Hello Human"
    })
})

router.use('/staff', staffRouter);

module.exports = router;