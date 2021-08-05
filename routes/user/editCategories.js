const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", categoriesPage);

async function categoriesPage(request, response, next) {
    try {
        let collectionName = "categories";
        let storeId = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
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
            address: "GET:/user/editCategories",
        });
    }
}

module.exports = router;
