const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", search);

async function search(request, response, next) {
    try {
        let { productNameForSearch } = request.query;
        let collectionName = request.store.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let resultProducts = await databaseClient
            .collection(collectionName)
            .find({
                productName: { $regex: productNameForSearch },
                inStock: { $gt: 0 },
            })
            .toArray();
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: collectionName })
            .toArray();

        response.render("products", {
            sort: 0,
            storeInfo: request.store.userStore,
            categories: categories,
            resultProducts: resultProducts,
            error: "",
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/search",
        });
    }
}

module.exports = router;
