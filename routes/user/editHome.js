const express = require("express");
const router = express.Router();
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
