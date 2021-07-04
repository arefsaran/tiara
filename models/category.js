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
            required: true,
        },
        storeId: {
            type: String,
            index: true,
            required: true,
        },
    },
    { timestamps: true }
);

function validateCategory(category) {
    const schema = Joi.object({
        categoryName: Joi.string().min(1).max(50).required().messages({
            "string.base": `نام درست را وارد کنید`,
            "string.empty": `نام نمی تواند خالی باشد`,
            "string.min": `نام نمی تواند خالی باشد`,
            "any.required": `نام نمی تواند خالی باشد`,
        }),
        storeId: Joi.string().min(1).max(50).required(),
        categoryID: Joi.number().email().min(5).max(1024).required(),
        categoryPicture: Joi.string().required(),
    });
    return schema.validate(category);
}

const category = mongoose.model("category", categorySchema);
exports.Category = category;
exports.validate = validateCategory;
