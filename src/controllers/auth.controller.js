const express = require('express');
const { User } = require('../models/User');
const { encode, validation } = require('../utilities/bcrypt');
const logger = require('../utilities/logger');


const findUserWithEmail = async (email) => {
    try {
        const user = await User.findOne({ email })
        return user;
    } catch (err) {
        throw err;
    }
}

const findUserWithUsername = async (username) => {
    try {
        const user = await User.findOne({ username })
        return user;
    } catch (err) {
        throw err;
    }
}

const isDuplicateUser = async (user) => {
    let userCheck;
    try {
        userCheck = await findUserWithUsername(user.username);
        if (userCheck) return true;
        userCheck = await findUserWithEmail(user.email);
        if (userCheck) return true;

        return false;
    } catch (err) {
        throw err;
    }
}

const authController = new express.Router();
authController.get('/signin', (req, res) => {
    // res.send("<h1>This is login page</h1>");
    const username = req.query.username;
    res.render('publicPages/login.ejs', { username, alert: null });
})

authController.get('/signup', (req, res) => {

    res.render('publicPages/register.ejs');
})

authController.get('/signout', (req, res) => {
    req.session.destroy(function (err) { res.redirect('/') });
})

authController.post('/signin', async (req, res) => {
    console.log(req.body)
    const userInputText = req.body.userInput;
    const password = req.body.password;
    const regexExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/gi;
    let isEmail = regexExp.test(userInputText);
    // console.log(isEmail)

    try {
        let userCheck;
        if (isEmail) {
            userCheck = await findUserWithEmail(userInputText)
        } else {
            userCheck = await findUserWithUsername(userInputText);
        }


        if (!userCheck) {
            return res.render('publicPages/login.ejs',
                {
                    username: userInputText,
                    alert: {
                        type: "warning",
                        message: "Incorrect username or password."
                    }
                });
        }

        console.log(userCheck);
        const passwordValidation = await validation(password, userCheck.password);

        if (passwordValidation) {
            req.session.userId = userCheck.id;
            console.log(req.session);
            return res.redirect('/');
        } else {
            return res.render('publicPages/login.ejs',
                {
                    username: userInputText,
                    alert: {
                        type: "warning",
                        message: "Incorrect username or password."
                    }
                });
        }
    } catch (err) {
        logger.error(err);
        res.send(500);
    }
});

authController.post('/signup', async (req, res) => {
    try {
        const { username, email, phone_number, password } = req.body;
        console.log(req.body)
        const isUserExist = await isDuplicateUser({ username, email })
        console.log("is that user exist", isUserExist)
        if (isUserExist) return res.status(400).json({ "status": "failed", "message": "The user is already exist" })

        const hashedPassword = await encode(password)
        const newUser = new User({ username, email, phone_number, password: hashedPassword })
        await newUser.save();
        req.session.userId = newUser.id;
        return res.json({ "status": "success" })
    } catch (err) {
        logger.error(err);
        return res.status(500).json({ "status": "failed", message: err.message });
    }
});

authController.get('/user/:id', async (req, res) => {
    try {
        const id = req.params.id ;
        const user = await User.findById(id);
        res.status(200);
        res.json(user);
     } catch (err) {
        logger.error(err);
        return res.status(500).json({ "status": "failed", message: err.message });
    }
})



module.exports = authController;