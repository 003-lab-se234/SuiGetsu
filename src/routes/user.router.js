const express = require('express');
const Cart = require('../models/Cart');
const { Food } = require('../models/Food');
const { User } = require('../models/User');
const logger = require('../utilities/logger');

const userRouter = new express.Router();

userRouter.get('/', async (req, res) => {
    res.send('This is user dashboard');
})

userRouter.get('/checkout', async (req, res) => {
    try {
        console.log(req.session.cart);
        const id = req.session.userId;
        const user = await User.findById(id);
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        res.render('userPages/checkout.ejs', { user , cart})

    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

userRouter.post('/cart', async (req, res) => {
    try {
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        const { id, qty } = req.body;

        const foodDoc = await Food.findById(id);

        if (!foodDoc) throw new Error('Invalid item');
        cart.add(foodDoc, Number(qty))
        // console.log(cart.records.length)

        req.session.cart = cart;
        res.json({ "status": "success" })
    } catch (err) {
        res.json({ "status": "error", message: err.message })
    }
})

userRouter.get('/remove/:id', (req, res) => {
    try {
        if (!req.session.cart) throw new Error("Invalid cart");
        const id = req.params.id;
        const cart = new Cart(req.session.cart);
        cart.remove(id);
        // cart.reloadCart();
        req.session.cart = cart;
        return res.redirect('/menu');
    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})


module.exports = userRouter;