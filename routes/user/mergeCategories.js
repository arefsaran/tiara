const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", mergeCategoriesView);
router.post("/", mergeCategories);

async function mergeCategoriesView(req, res, next) {
    try {
        const token = req.query.userToken || req.query.userTokenHide;
        let collectionName = "category";
        let storeId = req.user.userStore.storeId;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let originCategory = "";
        let destinationCategory = "";
        let errorType = 0;
        if (resultCategories.length > 1) {
            originCategory = resultCategories[0].categoryName;
            destinationCategory = resultCategories[0].categoryName;
        } else if (resultCategories.length < 1) {
            errorType = 2;
        } else if (resultCategories.length == 1) {
            errorType = 0;
            originCategory = resultCategories[0].categoryName;
            destinationCategory = resultCategories[0].categoryName;
        }
        res.render("mergeCategories", {
            storeInfo: req.user.userStore,
            mergeCategories: 0,
            error: errorType,
            originCategory: originCategory,
            destinationCategory: destinationCategory,
            resultCategories: resultCategories,
            token: token,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/mergeCategories",
        });
    }
}
async function mergeCategories(req, res, next) {
    try {
        let collectionName = "category";
        let storeId = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        const { originCategory, destinationCategory } = req.body;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        if (
            originCategory &&
            destinationCategory &&
            originCategory !== destinationCategory
        ) {
            let ecommerce = client.db(dbName);
            mongoose.connection.db.collection(storeId, (err, collection) => {
                collection.updateMany(
                    { categoryName: originCategory },
                    { $set: { categoryName: destinationCategory } }
                );
                mongoose.connection.db.collection(
                    collectionName,
                    (err, collection) => {
                        collection.deleteOne({
                            categoryName: originCategory,
                            storeId: storeId,
                        });
                    }
                );
            });
            let resultCategories = await ecommerce
                .collection(collectionName)
                .find({ storeId: storeId })
                .toArray();
            res.render("mergeCategories", {
                storeInfo: req.user.userStore,
                mergeCategories: 1,
                error: 0,
                originCategory: originCategory,
                destinationCategory: destinationCategory,
                resultCategories: resultCategories,
                token: token,
            });
        } else {
            let resultCategories = await ecommerce
                .collection(collectionName)
                .find({ storeId: storeId })
                .toArray();
            console.log(
                "storeInfo, originCategory,destinationCategory,resultCategories",
                req.user.userStore,
                originCategory,
                destinationCategory,
                resultCategories
            );
            res.render("mergeCategories", {
                storeInfo: req.user.userStore,
                mergeCategories: 0,
                error: 1,
                originCategory: originCategory,
                destinationCategory: destinationCategory,
                resultCategories: resultCategories,
                token: token,
            });
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/mergeCategories",
        });
    }
}

module.exports = router;