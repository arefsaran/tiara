const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", basketView);
router.post("/", basketCreator);
router.post("/api", basketFunction);

async function basketView(req, res, next) {
    try {
        res.render("basket", {
            storeInfo: req.store,
            error: "",
        });
    } catch (error) {
        res.render("basket", { storeInfo: req.store, error: error });
    }
}

async function basketCreator(req, res, next) {
    try {
        res.json({ Ok });
        next();
    } catch (error) {
        res.json({ error });
    }
}

async function basketFunction(req, res, next) {
    try {
        let collectionName = req.store.storeId;
        let dbName = "ecommerce";
        let { productId, quantity } = req.query;
        // console.log(quantity);
        const client = await MongoClient.connect(url, {
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
        // console.log(basketProducts);
        res.render("basket", {
            basketProducts: basketProducts,
            storeInfo: req.store,
            quantity: quantity,
            totalPrice: totalPrice,
        });
        // res.json({basketProducts:basketProducts});
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
