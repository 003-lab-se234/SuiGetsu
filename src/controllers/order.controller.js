const express = require('express');
const { Order } = require('../models/Order');
const { User } = require('../models/User');
const logger = require('../utilities/logger');

const orderController = new express.Router();

orderController.get('/' , async(req,res) => {
    try {
        let filter = {}
        let { status, page, owner } = req.query;
        // if (!page) page = 1;
        if (status && status != "any") filter = { ...filter, status };
        // if (title) filter = { ...filter, email:  };


        let userList = []
        const id = req.session.userId;
        const user = await User.findById(id);
        userList = await User.find({})
        let sort = {  status: 0, updatedAt: 1 };

        const order = await Order.find(filter).sort(sort).populate('records.item');
        console.log(order.food);

        res.render('staffPages/orders.ejs', { user , userList, data: order})
    }catch(err){
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

orderController.get('/update/:id' , async(req,res) => {
    try{
        const id = req.session.userId;
        const user = await User.findById(id);
        
        const orderId = req.params.id ;
        const order = await Order.findById(orderId).populate('records.item');

        res.render('staffPages/orderForm.ejs', {user , order})

        // res.json(order)
    }catch(err){
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

module.exports = orderController;