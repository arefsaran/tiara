const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
const ObjectId = require("mongoose").Types.ObjectId;
router.get("/", productPage);

async function productPage(request, response, next) {
    try {
        let collectionName = request.store.userStore.storeId;
        let { productId } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultCategories = await ecommerce
            .collection("category")
            .find({ storeId: collectionName })
            .toArray();
        let resultProduct = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        response.render("product", {
            resultCategories: resultCategories,
            storeInfo: request.store.userStore,
            resultProduct: resultProduct[0],
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/productPage",
        });
    }
}

module.exports = router;
