const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", sortAPI);

function sortAPI(request, response) {
    try {
        let { categoryName, sortBy } = request.query;
        let storeId = request.store.userStore.storeId;
        if (sortBy == "priceLowToHigh") {
            sortBy = { "productDetails.productPriceEnglishNumber": 1 };
        } else if (sortBy == "priceHighToLow") {
            sortBy = { "productDetails.productPriceEnglishNumber": -1 };
        }
        findFunction(categoryName, storeId);
        function findFunction(categoryName, storeId) {
            mongoose.connection.db.collection(storeId, function (
                err,
                collection
            ) {
                collection
                    .find({
                        categoryName: categoryName,
                        inStock: { $gt: 0 },
                    })
                    .sort(sortBy)
                    .toArray(showSorted);
            });
        }
        async function showSorted(err, sortedResult) {
            if (err) {
                console.log(err);
            } else {
                const client = await MongoClient.connect(DATABASE_ADDRESS, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                let databaseClient = client.db(DATABASE_NAME);
                let resultCategories = await databaseClient
                    .collection("categories")
                    .find({ storeId: storeId })
                    .toArray();
                response.render("products", {
                    sort: 1,
                    resultCategories: resultCategories,
                    storeInfo: request.store.userStore,
                    resultProducts: sortedResult,
                });
            }
        }
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/sort",
        });
    }
}

module.exports = router;
