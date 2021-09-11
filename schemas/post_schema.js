const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const post_schema = new Schema({
    _id: { type: String, default: mongoose.Types.ObjectId },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: String, ref: "category", required: true },
    user_id: { type: String, ref: "user", required: true },
    image: { type: String, required: true },
    created_at: { type: Number },
    updated_at: { type: Number },
},
    { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("post", post_schema);

