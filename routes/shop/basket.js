const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", basketView);
router.post("/", basketCreator);
router.post("/api", basketFunction);

async function basketView(req, res, next) {
    try {
        res.render("basket", {
            storeInfo: req.store.userStore,
            error: "",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/basket",
        });
    }
}

async function basketCreator(req, res, next) {
    try {
        res.json({ Ok });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/basket",
        });
    }
}

async function basketFunction(req, res, next) {
    try {
        let collectionName = req.store.userStore.storeId;
        let dbName = "ecommerce";
        let { productId, quantity } = req.query;
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let basketProducts = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        let totalPrice =
            basketProducts[0].productDetails.productPriceEnglishNumber *
            quantity;
        res.render("basket", {
            basketProducts: basketProducts,
            storeInfo: req.store.userStore,
            quantity: quantity,
            totalPrice: totalPrice,
        });
        // res.json({basketProducts:basketProducts});
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/basket/api",
        });
    }
}

module.exports = router;
