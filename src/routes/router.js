const router = require('express').Router()
const { log } = require('../middleware');

router.get('/', log, (req, res) => {
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.render('index.ejs', {
        title: "Hello Human"
    })
})

module.exports = router;