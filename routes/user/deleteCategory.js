const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
let ObjectId = require("mongodb").ObjectID;

router.get("/", deleteCategory);

async function deleteCategory(req, res, next) {
    try {
        let collectionName = "category";
        let storeId = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        const { deleteCategoryId } = req.query;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteCategoryId) });
        });
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        res.render("editCategories", {
            storeInfo: req.user.userStore,
            resultCategories: resultCategories,
            token: token,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/deleteCategory",
        });
    }
}

module.exports = router;
