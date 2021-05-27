const mongoose = require("mongoose");
// const config = require("config");

const purchaseSchema = new mongoose.Schema(
    {
        totalPrice: {
            type: Number,
            default: 0,
        },
        paidTime: {
            type: String,
            default: null,
        },
        done: {
            type: Number,
            default: 0,
        },
        purchaseId: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        basket: [
            {
                name: {
                    type: String,
                },
                id: {
                    type: String,
                },
                price: {
                    type: Number,
                },
                count: {
                    type: Number,
                    default: 1,
                },
                picture: {
                    type: String,
                },
            },
        ],
        customerInformations: {
            customerAddress: {
                type: String,
                default: "",
            },
            customerPostalCode: {
                type: String,
                default: "",
            },
            customerPhone: {
                type: String,
                default: "",
            },
            customerName: {
                type: String,
                default: "",
            },
            customerRecievedTime: {
                type: String,
                default: "",
            },
        },
        storeId: {
            type: String,
        },
    },
    { timestamps: true }
);

const purchase = mongoose.model("purchase", purchaseSchema);

exports.Purchase = purchase;
