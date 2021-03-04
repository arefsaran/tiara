const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;

router.get("/", supportView);

async function supportView(req, res, next) {
    try {
        res.render("support", { storeInfo: req.store });
        next();
    } catch (error) {
        res.json({
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
        });
    }
}

module.exports = router;
