const express = require('express');
const { User } = require('../models/User');
const { encode, validation } = require('../utilities/bcrypt');
const logger = require('../utilities/logger');


const authController = new express.Router();
authController.get('/signin', (req, res) => {
    // res.send("<h1>This is login page</h1>");
    res.render('login.ejs');
})

authController.get('/signup', (req, res) => {
    res.render('register.ejs');
})

authController.get('/signout' , (req ,res) => {
    req.session.destroy(function (err) { res.redirect('/') });
})

authController.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCheck = await User.findOne({ email });

        if (!userCheck) {
            console.log("This user does not exist.");
            return res.redirect('/auth/signup');
        }

        console.log(userCheck);
        const passwordValidation = await validation(password, userCheck.password);

        if (passwordValidation) {
            req.session.userId = userCheck.id;
            console.log(req.session);
            return res.redirect('/');
        } else {
            console.log('password incorrect')
            return res.redirect('/auth/signup');
        }
    } catch (err) {
        logger.error(err);
        res.send(500);
    }
});

authController.post('/signup', async (req, res) => {
    const { username, email, phone_number, password } = req.body;
    try {

        const userCheck = await User.findOne({ email });
        if (userCheck) {
            console.log("This user is already exist.");
            return res.redirect('/auth/signup');
        }

        const hashedPassword = await encode(password)
        const newUser = new User({ username, email, phone_number, password: hashedPassword })
        await newUser.save();
        req.session.userId = newUser.id;
        console.log(req.session);
        return res.redirect('/');
    } catch (err) {
        logger.error(err);
        res.send(500);
    }
});


module.exports = authController;