const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
let ObjectId = require("mongodb").ObjectID;

router.get("/", deleteCategory);

async function deleteCategory(request, response, next) {
    try {
        let collectionName = "category";
        let storeId = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        const { deleteCategoryId, categoryName } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteCategoryId) });
            mongoose.connection.db.collection(storeId, (err, collection) => {
                collection.deleteMany({ categoryName: categoryName });
            });
        });
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        response.render("editCategories", {
            storeInfo: request.user.userStore,
            resultCategories: resultCategories,
            token: token,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/deleteCategory",
        });
    }
}

module.exports = router;
