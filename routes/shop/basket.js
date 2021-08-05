const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", basketView);
router.post("/", basketCreator);
router.post("/api", basketFunction);

async function basketView(request, response, next) {
    try {
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultCategories = await ecommerce
            .collection("categories")
            .find({ storeId: request.store.userStore.storeId })
            .toArray();
        response.render("basket", {
            storeInfo: request.store.userStore,
            resultCategories: resultCategories,
            error: "",
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/basket",
        });
    }
}

async function basketCreator(request, response, next) {
    try {
        response.json({ Ok });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/basket",
        });
    }
}

async function basketFunction(request, response, next) {
    try {
        let collectionName = request.store.userStore.storeId;
        let { productId, quantity } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultCategories = await ecommerce
            .collection("categories")
            .find({ storeId: collectionName })
            .toArray();
        let basketProducts = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        let totalPrice =
            basketProducts[0].productDetails.productPriceEnglishNumber *
            quantity;
        response.render("basket", {
            resultCategories: resultCategories,
            basketProducts: basketProducts,
            storeInfo: request.store.userStore,
            quantity: quantity,
            totalPrice: totalPrice,
        });
        // response.json({basketProducts:basketProducts});
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/basket/api",
        });
    }
}

module.exports = router;
