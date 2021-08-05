const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
let ObjectId = require("mongodb").ObjectID;

router.get("/", deleteProduct);

async function deleteProduct(request, response, next) {
    try {
        let collectionName = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        const { deleteProductId, categoryName } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteProductId) });
        });
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ categoryName: categoryName })
            .toArray();
        response.render("editProducts", {
            storeInfo: request.user.userStore,
            resultProducts: resultProducts,
            token: token,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/deleteProduct",
        });
    }
}

module.exports = router;
