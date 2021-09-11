const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const category_schema = new Schema({
    _id: { type: String, default: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    created_by: { type: String },
    updated_by: { type: String },
    created_at: { type: Number },
    updated_at: { type: Number },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("category", category_schema);

