const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        bannerPicture: {
            type: String,
            required: true,
            index: true,
            default: "",
        },
        storeId: {
            type: String,
            index: true,
            required: true,
        },
    },
    { timestamps: true }
);

const banner = mongoose.model("banner", bannerSchema);

exports.Banner = banner;
