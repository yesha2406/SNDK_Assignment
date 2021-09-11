const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const user_schema = new Schema({
    _id: { type: String, default: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Number },
    updated_at: { type: Number },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("user", user_schema);

