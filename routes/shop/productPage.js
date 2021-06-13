const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;
router.get("/", productPage);

async function productPage(req, res, next) {
    try {
        let collectionName = req.store.storeId;
        let dbName = "ecommerce";
        let { productId } = req.query;
        const client = await MongoClient.connect(MONGO_DB, {
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
