const express = require("express");
const router = express.Router();
const url = require("url");
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const urlMongo = serverConfig.mongoDB;

router.get("/", homeViewFunction);

async function homeViewFunction(req, res, next) {
    try {
        let collectionName = "categories";
        let dbName = "ecommerce";
        const client = await MongoClient.connect(urlMongo, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const token = req.query.userToken || req.query.userTokenHide;
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find()
            .toArray();
        return res.render("editHome", {
            storeInfo: req.user.userStore,
            resultCategories: resultCategories,
            token: token,
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
