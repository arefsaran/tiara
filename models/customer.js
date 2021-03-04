const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const customerSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 50,
            index: true,
        },
        customerAddress: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 250,
            index: true,
        },
        customerPhone: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024,
            unique: true,
            index: true,
        },
    },
    { timestamps: true }
);

function validateCustomer(customer) {
    const schema = Joi.object({
        customerName: Joi.string().min(3).max(250).required(),
        customerAddress: Joi.string().min(10).max(250).required(),
        customerPhone: Joi.number().min(5).max(1024).required(),
    });
    return schema.validate(customer);
}

const Customer = mongoose.model("Customer", customerSchema);

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
