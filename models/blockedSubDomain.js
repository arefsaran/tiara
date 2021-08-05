const mongoose = require("mongoose");

const blockedSubDomainSchema = new mongoose.Schema(
    {
        blockedSubDomain: {
            type: String,
            required: true,
            index: true,
            default: "",
        },
    },
    { timestamps: true }
);

const blockedSubDomain = mongoose.model(
    "block_subdomain",
    blockedSubDomainSchema
);

exports.BlockedSubDomain = blockedSubDomain;
