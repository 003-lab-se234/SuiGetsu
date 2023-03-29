const mongoose = require("mongoose");


const record = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        enum: ['main', 'side', 'drink', 'appetizer', 'dessert']
    },
    image_path: {
        type: String
    },
    quantity: {
        type: Number,
        require: true
    }

})


const OrderSchema = new mongoose.Schema({
    owner_id: {
        type: String,
        require: true
    },
    records: { 
        type: [record], 
        require: true 
    },
    desitination: {
        type: String,
        require: true 
    }

});

exports.Food = mongoose.model('order', OrderSchema);