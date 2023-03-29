const express = require('express');
const foodController = require('../controllers/food.controller');
const logger = require('../utilities/logger');

const staffRouter = new express.Router();

staffRouter.get('/' , (req,res) => {
    res.send('This is dashboard');
})

staffRouter.use('/food' , foodController );
// staffRouter.use('/order')

module.exports = staffRouter ;