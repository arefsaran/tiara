const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", productsPage);

async function productsPage(req, res, next) {
    try {
        let collectionName = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        let dbName = "ecommerce";
        let { categoryName } = req.query;
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ categoryName: categoryName })
            .toArray();
        res.render("editProducts", {
            storeInfo: req.user.userStore,
            resultProducts: resultProducts,
            token: token,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/editProducts",
        });
    }
}

module.exports = router;
