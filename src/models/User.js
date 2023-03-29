const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    phone_number: { type: String, require: true },
    role: { type: String, default: "customer" }
})

exports.User = mongoose.model("user", UserSchema);