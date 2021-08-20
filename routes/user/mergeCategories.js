const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", mergeCategoriesView);
router.post("/", mergeCategories);

async function mergeCategoriesView(request, response, next) {
    try {
        const token = request.query.userToken || request.query.userTokenHide;
        let collectionName = "categories";
        let storeId = request.user.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let originCategory = "";
        let destinationCategory = "";
        let errorType = 0;
        if (categories.length > 1) {
            originCategory = categories[0].categoryName;
            destinationCategory = categories[0].categoryName;
        } else if (categories.length < 1) {
            errorType = 2;
        } else if (categories.length == 1) {
            errorType = 0;
            originCategory = categories[0].categoryName;
            destinationCategory = categories[0].categoryName;
        }
        response.render("mergeCategories", {
            storeInfo: request.user.userStore,
            mergeCategories: 0,
            error: errorType,
            originCategory: originCategory,
            destinationCategory: destinationCategory,
            categories: categories,
            token: token,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/mergeCategories",
        });
    }
}
async function mergeCategories(request, response, next) {
    try {
        let collectionName = "categories";
        let storeId = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        const { originCategory, destinationCategory } = request.body;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        if (
            originCategory &&
            destinationCategory &&
            originCategory !== destinationCategory
        ) {
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
            let categories = await databaseClient
                .collection(collectionName)
                .find({ storeId: storeId })
                .toArray();
            response.render("mergeCategories", {
                storeInfo: request.user.userStore,
                mergeCategories: 1,
                error: 0,
                originCategory: originCategory,
                destinationCategory: destinationCategory,
                categories: categories,
                token: token,
            });
        } else {
            let categories = await databaseClient
                .collection(collectionName)
                .find({ storeId: storeId })
                .toArray();
            response.render("mergeCategories", {
                storeInfo: request.user.userStore,
                mergeCategories: 0,
                error: 1,
                originCategory: originCategory,
                destinationCategory: destinationCategory,
                categories: categories,
                token: token,
            });
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/mergeCategories",
        });
    }
}

module.exports = router;
