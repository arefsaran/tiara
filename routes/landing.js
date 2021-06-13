const express = require("express");
const router = express.Router();
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../config/config");

const urlMongo = MONGO_DB;
router.get("/", landing);

async function landing(req, res, next) {
    try {
        let collectionName = "categories";
        let dbName = "ecommerce";
        const client = await MongoClient.connect(urlMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find()
            .toArray();
        res.render("home", {
            storeInfo: req.store,
            resultCategories: resultCategories,
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
