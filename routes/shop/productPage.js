const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;
router.get("/", productPage);

async function productPage(req, res, next) {
    try {
        let collectionName = req.store.userStore.storeId;
        let dbName = "ecommerce";
        let { productId } = req.query;
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection("category")
            .find({ storeId: collectionName })
            .toArray();
        let resultProduct = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        res.render("product", {
            resultCategories: resultCategories,
            storeInfo: req.store.userStore,
            resultProduct: resultProduct[0],
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/productPage",
        });
    }
}

module.exports = router;
