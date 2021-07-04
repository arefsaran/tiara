const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
const mongoose = require("mongoose");

router.get("/", homeViewFunction);

async function homeViewFunction(req, res, next) {
    try {
        let collectionName = "categories";
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        mongoose.connection.db.collection("purchases", function (
            err,
            collection
        ) {
            collection.updateMany({}, { $set: { done: 1 } });
        });
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find()
            .toArray();
        return res.render("home", {
            resultCategories: resultCategories,
            storeInfo: req.store,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/",
        });
    }
}

module.exports = router;
