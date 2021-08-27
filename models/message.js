const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
            index: true,
        },
        subject: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const message = mongoose.model("message", messageSchema);

exports.Message = message;
