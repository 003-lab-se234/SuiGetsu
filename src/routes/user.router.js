const express = require('express');
const Cart = require('../models/Cart');
const { Food } = require('../models/Food');
const { Order } = require('../models/Order');
const { User } = require('../models/User');
const logger = require('../utilities/logger');
const generatePayload = require('promptpay-qr')

const userRouter = new express.Router();

userRouter.get('/', async (req, res) => {
    res.send('This is user dashboard');
})

userRouter.get('/checkout', async (req, res) => {
    try {
        const id = req.session.userId;
        const user = await User.findById(id);
        const cart = new Cart(req.session.cart ? req.session.cart : {});

        res.render('userPages/checkout.ejs', { user, cart })

    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

userRouter.post('/checkout', async (req, res) => {
    try {
        if (!req.session.cart || req.session.cart.totalQty == 0) throw new Error("Invalid items")
        const cart = new Cart(req.session.cart);

        const { houseNumber, amphoe, district, province, country, zipcode, note, firstname, lastname, telephone } = req.body;
        const owner_id = req.session.userId;
        const address = `${houseNumber}, ${amphoe}, ${district} district ${province} ${zipcode} ${country}`;
        const shipping_price = 15;
        const product_price = cart.totalPrice;

        let records = [];
        cart.toArray().forEach(record => {
            const docRec = {
                item: record.item._id,
                qty: record.qty
            }
            records.push(docRec)
        })

        const payload = {
            owner_id,
            records,
            destination: address,
            shipping_price,
            product_price,
            total_price: Number(product_price) + Number(shipping_price),
            note,
            firstname, lastname, telephone
        }
        // res.json(payload)
        const order = new Order(payload);
        const saveDoc = await order.save();
        if (saveDoc) req.session.cart = new Cart({});

        res.redirect(`/user/order/${saveDoc.id}`)

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
        req.session.cart = cart;
        res.json({ "status": "success" })
    } catch (err) {
        res.json({ "status": "error", message: err.message })
    }
})

userRouter.get('/remove/:id', (req, res) => {
    try {
        const { page, category } = req.query;
        if (!req.session.cart) throw new Error("Invalid cart");
        const id = req.params.id;
        const cart = new Cart(req.session.cart);
        cart.remove(id);
        // cart.reloadCart();
        req.session.cart = cart;
        return res.redirect(`/menu?category=${category}&page=${page}`);
    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

userRouter.get('/orders', async (req, res) => {
    try {
        
        const owner_id = req.session.userId;
        let filter = {owner_id}
        let { status } = req.query;
        // if (!page) page = 1;
        if (status && status != "any") filter = { ...filter, status };
        // if (title) filter = { ...filter, email:  };
        // res.send('Show all orders')
        const user = await User.findById(owner_id);
        const orders = await Order.find(filter).populate('records.item');
        res.render('userPages/orders.ejs', { user, data: orders })

    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})


userRouter.get('/order/:orderId', async (req, res) => {
    try {
        const id = req.session.userId;
        const user = await User.findById(id);
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('records.item');

        // check order category
        // is pending generate QR code
        const qr_code = generatePayload('0910677794', { amount: order.total_price })
        // res.send(qr_code)
        // console.log(qr_code)
        res.render('userPages/orderDetail.ejs', { qr_code, user, order: order })
        // res.json(order.total_price);
    } catch (err) {
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }

})


module.exports = userRouter;