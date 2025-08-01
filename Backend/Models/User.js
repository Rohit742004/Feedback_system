const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String // In production, hash it with bcrypt
});

module.exports = mongoose.model("User", userSchema);
