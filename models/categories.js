const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        categoryName: {
            type: String,
            required: true,
            index: true,
            default: "",
        },
        categoryPicture: {
            type: String,
            index: true,
        },
        categoryNameForRequest: {
            type: String,
            index: true,
        },
    },
    { timestamps: true }
);

const category = mongoose.model("category", categorySchema);

exports.Categories = category;
