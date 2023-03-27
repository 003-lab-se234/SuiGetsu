const express = require('express');
const { Food } = require('../models/Food');
const logger = require('../utilities/logger');
const upload = require('../utilities/upload').single('image');
const path = require('path');
const deleter = require('../utilities/deleter');



const foodController = new express.Router();
foodController.get('/', async (req, res) => {
    // console.log(req.query)
    let { category, page, title } = req.query;
    if (!page) page = 1;
    if (!title) title = '';
    if (!category) category = 'any';

    const filter = {
        category,
        title
    }

    let sort = { is_outofstock: 1, updatedAt: 1 }

    console.log(filter, sort)

    res.render('staffPages/foods.ejs')
})

foodController.get('/add', (req, res) => {
    // add item input form
    // res.send("<h1>This is staff add form</h1>");
    res.render('staffPages/foodForm.ejs')
})

foodController.post('/', async (req, res) => {
    // console.log(req.body)
    // 
    //Create
    try {
        upload(req, res, async (err) => {
            const { item_id, title, description, price, category, is_outofstock } = req.body;

            if (item_id == undefined || item_id == '') {

                if (err) {
                    logger.error(err);
                    return res.send(500)
                }

                const image = req.file === undefined ? '' : req.file.filename;
                let image_path;
                if (image == '') {
                    image_path = '/public/404'
                } else {
                    image_path = `/public/uploads/foods/${image}`
                }

                const food = new Food({
                    title,
                    description,
                    price,
                    image_path,
                    category,
                    is_outofstock
                });

                await food.save();
                return res.redirect('/staff/food')
            } else {

                console.log(item_id)
                const oldData = await Food.findById(item_id)
                if (!oldData) {
                    return res.redirect('/staff/food');
                }

                if (req.file === undefined) {
                    // the image is not uploaded
                    const update = await Food.findByIdAndUpdate(oldData.id, { title, description, price, category, is_outofstock });
                    logger.info(`Update ${update.id}`);
                    return res.redirect('/staff/food');
                } else {
                    // new image has been uploaded
                    const newImage = req.file.filename;
                    image_path = `/public/uploads/foods/${newImage}`
                    const update = await Food.findByIdAndUpdate(oldData.id, { title, description, price, image_path, category, is_outofstock });
                    logger.info(`Update ${update.id}`);

                    await deleter(path.join(__dirname, '../..', oldData.image_path));

                    console.log({ old: oldData.image_path, new: newImage })
                    return res.redirect('/staff/food');
                    // return res.json( {image_path , ...oldData.id})
                }



            }
        })
    } catch (err) {
        logger.error(err);
        return res.send(500)
    }




})

foodController.get('/:id', (req, res) => {
    //edit page
    res.send("<h1>This is staff food edit item</h1>");
})

module.exports = foodController;