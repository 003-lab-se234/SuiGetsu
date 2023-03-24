const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    name: { type: String, required: true, default: "Test" }
})

exports.Item = mongoose.model("item", ItemSchema)