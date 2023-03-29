const express = require('express');
const Cart = require('../models/Cart');
const logger = require('../utilities/logger');

const userRouter = new express.Router();

userRouter.get('/', (req, res) => {
    // Cart
    const mockCart = new Cart();

    mockCart.add({
        id: "abx1",
        name: "test1",
        price: 5
    }, 2);

    mockCart.add({
        id: "abx2",
        name: "test2",
        price: 1
    }, 5);
    console.log(mockCart);

    mockCart.set([
        {
            item: {
                id: "abx2",
                name: "test2",
                price: 10
            },
            qty: 2
        }
    ])
    // mockCart.remove("abx2")

    console.log(mockCart);
    res.send('This is user dashboard');
})


module.exports = userRouter;