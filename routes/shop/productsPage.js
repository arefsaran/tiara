const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", productsPage);

async function productsPage(req, res, next) {
    try {
        let collectionName = req.store.userStore.storeId;
        let dbName = "ecommerce";
        let { categoryName } = req.query;
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ categoryName: categoryName, inStock: { $gt: 0 } })
            .toArray();
        let resultCategories = await ecommerce
            .collection("category")
            .find({ storeId: collectionName })
            .toArray();
        res.render("products", {
            resultCategories: resultCategories,
            storeInfo: req.store.userStore,
            resultProducts: resultProducts,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/productsPage",
        });
    }
}

module.exports = router;
