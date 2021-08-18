const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", basketView);
router.post("/", basket);

async function basketView(request, response, next) {
    try {
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: request.store.userStore.storeId })
            .toArray();
        response.render("basket", {
            storeInfo: request.store.userStore,
            categories: categories,
            error: "",
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/basket",
        });
    }
}

async function basket(request, response, next) {
    try {
        let collectionName = request.store.userStore.storeId;
        let { productId, quantity } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: collectionName })
            .toArray();
        let basketProducts = await databaseClient
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        let totalPrice =
            basketProducts[0].productDetails.productPriceEnglishNumber *
            quantity;
        response.render("basket", {
            categories: categories,
            basketProducts: basketProducts,
            storeInfo: request.store.userStore,
            quantity: quantity,
            totalPrice: totalPrice,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/basket",
        });
    }
}

module.exports = router;
