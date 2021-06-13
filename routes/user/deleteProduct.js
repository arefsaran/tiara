const express = require("express");
const router = express.Router();
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const url = serverConfig.mongoDB;
let ObjectId = require("mongodb").ObjectID;

router.get("/", deleteProduct);

async function deleteProduct(req, res, next) {
    try {
        let collectionName = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        const { deleteProductId, categoryNameForRequest } = req.query;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteProductId) });
        });
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
        console.log(error);
    }
}

module.exports = router;
