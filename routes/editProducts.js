const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;

router.get("/", productsPage);

async function productsPage(req, res, next) {
    try {
        let collectionName = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        let dbName = "ecommerce";
        let { categoryNameForRequest } = req.query;
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ productType: categoryNameForRequest })
            .toArray();
        res.render("editProducts", {
            storeInfo: req.user.userStore,
            resultProducts: resultProducts,
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
