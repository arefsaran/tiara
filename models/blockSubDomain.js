const mongoose = require("mongoose");

const blockSubDomainSchema = new mongoose.Schema(
    {
        blockSubDomain: {
            type: String,
            required: true,
            index: true,
            default: "",
        },
    },
    { timestamps: true }
);

const blockSubDomain = mongoose.model("blockSubDomain", blockSubDomainSchema);

exports.BlockSubDomain = blockSubDomain;
