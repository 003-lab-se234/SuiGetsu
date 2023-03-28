const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        require: true
    },
    description: {
        type: String,
        trim: true,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    image_path: {
        type: String
    },
    category: {
        type: String,
        enum: ['main', 'side', 'drink', 'appetizer', 'dessert']
    },
    is_outofstock: Boolean
},
    {
        timestamps: true
    });

exports.Food = mongoose.model('food', FoodSchema);

