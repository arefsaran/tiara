const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", storeInfo);

async function storeInfo(request, response, next) {
    try {
        let storeInfo = request.store.userStore;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: request.store.userStore.storeId })
            .toArray();
        response.render("storeInfo", {
            categories: categories,
            storeInfo: storeInfo,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/storeInfo",
        });
    }
}

module.exports = router;
