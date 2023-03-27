const express = require('express');
const { Food } = require('../models/Food');
const logger = require('../utilities/logger');
const upload = require('../utilities/upload').single('image');
const path = require('path');
const deleter = require('../utilities/deleter');
const { paginate } = require('../utilities/paginate');



const foodController = new express.Router();
foodController.get('/', async (req, res) => {
    // console.log(req.query)
    let { category, page, title } = req.query;
    let filter = {}
    if (!page) page = 1;
    if (category && category != "any") filter = { ...filter, category };
    if (title) filter = { ...filter, title: { $regex: new RegExp(`${title}`), $options: 'i' } };

    let sort = { is_outofstock: 1, updatedAt: 1 }
    // console.log(filter, sort)

    const foods = await Food.find(filter).sort(sort);
    const paginateFood = paginate(foods, page, 6);

    res.render('staffPages/foods.ejs', { data: paginateFood, category, page, title })
})

// foodController.get('/patch')

foodController.get('/patch/:id?', async (req, res) => {

    const paramId = req.params.id;

    const foodDoc = await Food.findById(paramId);
    console.log(foodDoc)


    res.render('staffPages/foodForm.ejs', { foodDoc })
})

foodController.post('/', async (req, res) => {
    // console.log(req.body)
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

                    // console.log({ old: oldData.image_path, new: newImage })
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



module.exports = foodController;