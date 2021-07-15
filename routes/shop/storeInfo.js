const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", storeInfo);

async function storeInfo(req, res, next) {
    try {
        let storeInfo = req.store.userStore;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection("category")
            .find({ storeId: req.store.userStore.storeId })
            .toArray();
        res.render("storeInfo", {
            resultCategories: resultCategories,
            storeInfo: storeInfo,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/storeInfo",
        });
    }
}

module.exports = router;
