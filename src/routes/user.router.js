const express = require('express');
const Cart = require('../models/Cart');
const { Food } = require('../models/Food');
const { Order } = require('../models/Order');
const { User } = require('../models/User');
const logger = require('../utilities/logger');

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

        const { houseNumber, amphoe, district, province, country, zipcode, note } = req.body;
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
            desitination: address,
            shipping_price,
            product_price,
            total_price: Number(product_price) + Number(shipping_price),
            note
        }
        // res.json(payload)
        const order = new Order(payload);
        const saveDoc = await order.save();
        if(saveDoc) req.session.cart = new Cart({});
        
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

userRouter.get('/orders' , async(req,res) => {
    try{
        const owner_id = req.session.userId ;
        // res.send('Show all orders')
        const orders = await Order.find({owner_id}).populate('records.item');
        res.json(orders);
    }catch(err){
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

userRouter.get('/order/:orderId' , async(req,res) => {
    try{
        const orderId = req.params.orderId ;
        const order = await Order.findById(orderId).populate('records.item');
        res.json(order);
    }catch(err){
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }

})


module.exports = userRouter;