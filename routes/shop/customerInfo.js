const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", customerInfoView);

async function customerInfoView(request, response, next) {
    try {
        let { error } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultCategories = await ecommerce
            .collection("categories")
            .find({ storeId: request.store.userStore.storeId })
            .toArray();
        if (error) {
            response.render("customerInfo", {
                resultCategories: resultCategories,
                storeInfo: request.store.userStore,
                MERCHANT_ID: request.store.MERCHANT_ID,
                error: error,
            });
        } else {
            response.render("customerInfo", {
                resultCategories: resultCategories,
                storeInfo: request.store.userStore,
                MERCHANT_ID: request.store.MERCHANT_ID,
                error: "",
            });
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/customerInfo",
        });
    }
}

module.exports = router;
