const express = require("express");
const router = express.Router();
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

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
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
        });
    }
}

module.exports = router;
