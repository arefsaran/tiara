const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", customerInfoView);

async function customerInfoView(req, res, next) {
    try {
        let { error } = req.query;
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
        if (error) {
            res.render("customerInfo", {
                resultCategories: resultCategories,
                storeInfo: req.store.userStore,
                MERCHANT_ID: req.store.MERCHANT_ID,
                error: error,
            });
        } else {
            res.render("customerInfo", {
                resultCategories: resultCategories,
                storeInfo: req.store.userStore,
                MERCHANT_ID: req.store.MERCHANT_ID,
                error: "",
            });
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/customerInfo",
        });
    }
}

module.exports = router;
