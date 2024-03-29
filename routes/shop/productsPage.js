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
        let databaseClient = client.db(DATABASE_NAME);
        let resultProducts = await databaseClient
            .collection(collectionName)
            .find({ categoryName: categoryName, inStock: { $gt: 0 } })
            .toArray();
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: collectionName })
            .toArray();
        response.render("products", {
            sort: 1,
            categories: categories,
            storeInfo: request.store.userStore,
            resultProducts: resultProducts,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/productsPage",
        });
    }
}

module.exports = router;
