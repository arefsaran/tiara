const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const { JWT_PRIVATE_KEY } = require("../config/config");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 50,
            index: true,
        },
        userEmail: {
            type: String,
            required: true,
            minlength: 5,
            maxlength: 1024,
            unique: true,
            index: true,
        },
        userPassword: {
            type: String,
            required: true,
            minlength: 4,
            maxlength: 1024,
        },
        userStore: {
            storeName: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 250,
                index: true,
            },
            storePicture: {
                type: String,
                index: true,
            },
            storeId: {
                type: String,
                required: true,
                index: true,
                unique: true,
            },
            storePlan: {
                planType: {
                    type: Number,
                    default: 1,
                },
                planTimeToExpiry: {
                    type: Number,
                    default: 30,
                },
                planPrice: {
                    type: Number,
                    default: 0,
                },
            },
            paidTime: {
                type: String,
                default: "",
            },
            storeAddress: {
                type: String,
                default: "",
            },
            storePhoneNumber: {
                type: String,
                default: "",
            },
            storeSalesperson: {
                salespersonName: {
                    type: String,
                    default: "",
                },
                salespersonPhoneNumber: {
                    type: Number,
                },
            },
            storeLicenseNumber: {
                type: String,
                default: "",
            },
            storeDeliveryPrice: {
                type: Number,
            },
            storeFreeDeliveryPrice: {
                type: Number,
            },
        },
        purchaseID: {
            type: String,
            default: "",
        },
        userPaid: {
            type: Number,
            default: 0,
        },
        updateTime: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        { _id: this._id, userPassword: this.userPassword },
        JWT_PRIVATE_KEY
    );
    return token;
};

function validateUser(user) {
    const schema = Joi.object({
        userName: Joi.string().min(1).max(50).required().messages({
            "string.base": `نام و نام خانوادگی درست را وارد کنید`,
            "string.empty": `نام و نام خانوادگی نمی تواند خالی باشد`,
            "string.min": `نام و نام خانوادگی نمی تواند خالی باشد`,
            "any.required": `نام و نام خانوادگی نمی تواند خالی باشد`,
        }),
        userStoreName: Joi.string().min(1).max(250).required(),
        userStoreNameInEnglish: Joi.string().min(1).max(250).required(),
        userEmail: Joi.string().email().min(5).max(1024).required(),
        userPassword: Joi.string().min(4).max(1024).required(),
    });
    return schema.validate(user);
}
function validateLoginUser(user) {
    const schema = Joi.object({
        userEmail: Joi.string().min(5).max(1024).email().required(),
        userPassword: Joi.string().required(),
    });
    return schema.validate(user);
}
const User = mongoose.model("User", userSchema);

exports.User = User;
exports.validate = validateUser;
exports.validateLogin = validateLoginUser;
