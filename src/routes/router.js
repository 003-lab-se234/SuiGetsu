const router = require('express').Router()
const path = require('path');
const { log } = require('../middleware');

router.get('/', log, (req, res) => {
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.render('index.ejs', {
        title: "Hello Human"
    })
})

router.get('/about', (req, res) => {
    // res.send("To be continued");
    res.status(200);
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'about.html'))

})

router.get('/contact', (req, res) => {
    // res.send("To be continued");
    res.status(200);
    res.setHeader('content-type', 'text/html');
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'contact.html'));
})

router.get('/menu', (req, res) => {

    // check wether user have logged in or not
    // res.render('menu.ejs' , { user } ) if user is logged in order and cart button will be displayed
    res.status(200);
    res.setHeader("Content-type", "text/html");
    res.send("To be continued");
})


module.exports = router;