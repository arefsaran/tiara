const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", productsPage);

async function productsPage(request, response, next) {
    try {
        let collectionName = request.store.userStore.storeId;
        let { categoryName } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ categoryName: categoryName, inStock: { $gt: 0 } })
            .toArray();
        let resultCategories = await ecommerce
            .collection("category")
            .find({ storeId: collectionName })
            .toArray();
        response.render("products", {
            sort: 1,
            resultCategories: resultCategories,
            storeInfo: request.store.userStore,
            resultProducts: resultProducts,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/productsPage",
        });
    }
}

module.exports = router;
