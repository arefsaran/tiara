const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            required: true,
            index: true,
            default: "",
        },
        productPicture: {
            type: String,
            index: true,
        },
        categoryId: {
            type: String,
            index: true,
        },
        productTypeInPersian: {
            type: String,
            index: true,
        },
        productNameForRequest: {
            type: String,
            index: true,
        },
        productDetails: {
            productPrice: {
                type: String,
                index: true,
            },
            productManufacturingDate: {
                type: String,
                index: true,
            },
            productExpirationDate: {
                type: String,
                index: true,
            },
            productSize: {
                type: String,
                index: true,
            },
            productPriceEnglishNumber: {
                type: Number,
                index: true,
            },
            subType: {
                type: String,
                index: true,
            },
        },
        storeId: {
            type: String,
            index: true,
        },
        inStock: {
            type: String,
            index: true,
        },
    },
    { timestamps: true }
);
const product = mongoose.model("product", productSchema);

exports.Product = product;
