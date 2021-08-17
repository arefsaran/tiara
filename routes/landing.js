const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../config/config");

const urlMongo = DATABASE_ADDRESS;
router.get("/", landing);

async function landing(request, response, next) {
    try {
        let collectionName = "categories";
        const client = await MongoClient.connect(urlMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let resultCategories = await databaseClient
            .collection(collectionName)
            .find()
            .toArray();
        response.render("home", {
            storeInfo: request.store.userStore,
            resultCategories: resultCategories,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/landing",
        });
    }
}

module.exports = router;
