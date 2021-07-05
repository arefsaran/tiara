const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
let ObjectId = require("mongodb").ObjectID;

router.get("/", deleteProduct);

async function deleteProduct(req, res, next) {
    try {
        let collectionName = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        const { deleteProductId, categoryName } = req.query;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteProductId) });
        });
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
            address: "GET:/user/deleteProduct",
        });
    }
}

module.exports = router;
