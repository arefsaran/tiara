const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { JWT_PRIVATE_KEY } = require("../config/config");
const adminSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            default: "",
        },
        lastName: {
            type: String,
            required: true,
            default: "",
        },
        email: {
            type: String,
            required: true,
            index: true,
            default: "",
        },
        password: {
            type: String,
            required: true,
            index: true,
        },
        level: {
            type: Number,
            index: true,
            default: 1,
        },
    },
    { timestamps: true }
);

adminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, password: this.password },
        JWT_PRIVATE_KEY
    );
    return token;
};

function validateAdmin(admin) {
    const schema = Joi.object({
        firstName: Joi.string().min(1).max(50).required().messages({
            "string.base": `نام درست را وارد کنید`,
            "string.empty": `نام نمی تواند خالی باشد`,
            "string.min": `نام نمی تواند خالی باشد`,
            "any.required": `نام نمی تواند خالی باشد`,
        }),
        lastName: Joi.string().min(1).max(50).required().messages({
            "string.base": `نام خانوادگی درست را وارد کنید`,
            "string.empty": `نام خانوادگی نمی تواند خالی باشد`,
            "string.min": `نام خانوادگی نمی تواند خالی باشد`,
            "any.required": `نام خانوادگی نمی تواند خالی باشد`,
        }),
        email: Joi.string().email().min(5).max(1024).required(),
        password: Joi.string().min(4).max(1024).required(),
    });
    return schema.validate(admin);
}

function validateLoginAdmin(admin) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(1024).email().required(),
        password: Joi.string().required(),
    });
    return schema.validate(admin);
}

const admin = mongoose.model("admin", adminSchema);
exports.Admin = admin;
exports.validate = validateAdmin;
exports.validateLogin = validateLoginAdmin;
