const express = require('express');
const foodController = require('../controllers/food.controller');
const orderController = require('../controllers/order.controller');
const { User } = require('../models/User');
const logger = require('../utilities/logger');

const staffRouter = new express.Router();

staffRouter.get('/dashboard' , async(req,res) => {
    try {
        const id = req.session.userId;
        const user = await User.findById(id);
        res.render('staffPages/dashboard.ejs', { user })
    }catch(err){
        logger.error(err);
        res.status(500);
        return res.render('publicPages/error.ejs', { error: err })
    }
})

staffRouter.use('/food' , foodController );
staffRouter.use('/order' , orderController )

module.exports = staffRouter ;