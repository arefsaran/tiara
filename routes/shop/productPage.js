const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;
const ObjectId = require("mongoose").Types.ObjectId;
router.get("/", productPage);

async function productPage(req, res, next) {
    try {
        let collectionName = req.store.storeId;
        let dbName = "ecommerce";
        let { productId } = req.query;
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultProduct = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        res.render("product", {
            storeInfo: req.store,
            resultProduct: resultProduct[0],
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
