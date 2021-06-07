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

const blockSubDomain = mongoose.model("block_subdomain", blockSubDomainSchema);

exports.BlockSubDomain = blockSubDomain;
