const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", productsPage);

async function productsPage(req, res, next) {
    try {
        let collectionName = req.store.storeId;
        let dbName = "ecommerce";
        let { categoryNameForRequest } = req.query;
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ productType: categoryNameForRequest })
            .toArray();
        res.render("products", {
            storeInfo: req.store,
            resultProducts: resultProducts,
        });
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
