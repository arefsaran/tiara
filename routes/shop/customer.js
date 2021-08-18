const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", customer);

async function customer(request, response, next) {
    try {
        let { error } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: request.store.userStore.storeId })
            .toArray();
        if (error) {
            response.render("customer", {
                categories: categories,
                storeInfo: request.store.userStore,
                MERCHANT_ID: request.store.MERCHANT_ID,
                error: error,
            });
        } else {
            response.render("customer", {
                categories: categories,
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
            path: "GET:/customer",
        });
    }
}

module.exports = router;
