const express = require('express');
const Cart = require('../models/Cart');
const { Food } = require('../models/Food');
const logger = require('../utilities/logger');

const userRouter = new express.Router();

userRouter.get('/', async (req, res) => {
    res.send('This is user dashboard');
})

userRouter.get('/cart', (req, res) => {
    res.send(req.session.cart);
})
userRouter.post('/cart', async (req, res) => {
    try {
        const cart = new Cart(req.session.cart ? req.session.cart : {});
        // console.log(cart)
        // const userId = req.session.userId ;
        const { id, qty } = req.body;

        const foodDoc = await Food.findById(id);
        // console.log(foodDoc)

        if (!foodDoc) throw new Error('Invalid item');


        cart.add(foodDoc, Number(qty))
        // console.log(cart.records.length)

        req.session.cart = cart;
        res.json({ "status": "success" })
    } catch (err) {
        res.json({ "status": "error", message: err.message })
    }
})


module.exports = userRouter;