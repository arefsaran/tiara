const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", productsPage);

async function productsPage(request, response, next) {
    try {
        let collectionName = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        let { categoryName } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let resultProducts = await databaseClient
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
            path: "GET:/user/editProducts",
        });
    }
}

module.exports = router;
