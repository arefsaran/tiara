const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const planSchema = new mongoose.Schema(
    {
        planName: {
            type: String,
            required: true,
            default: "",
            index: true,
        },
        planFeatures: [
            {
                feature: {
                    type: String,
                    default: "",
                    index: true,
                },
            },
        ],

        planPrice: {
            price: {
                type: Number,
                required: true,
                default: 0,
            },
            discount: {
                type: Number,
                default: 0,
            },
        },
        planTimeToExpiry: {
            type: Number,
            required: true,
            default: 30,
        },
    },
    { timestamps: true }
);

function validatePlan(plan) {
    const schema = Joi.object({
        planName: Joi.string().min(3).max(250).required(),
        planTimeToExpiry: Joi.number().min(1).max(365).required(),
        "planPrice.price": Joi.number().min(0).required(),
        "planPrice.discount": Joi.number(),
    });
    return schema.validate(plan);
}

const Plan = mongoose.model("Plan", planSchema);

exports.Plan = Plan;
exports.validatePlan = validatePlan;
