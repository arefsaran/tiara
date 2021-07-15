const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");

router.get("/", sortAPI);

function sortAPI(req, res) {
    try {
        let { categoryName, sortBy } = req.query;
        let storeId = req.store.userStore.storeId;
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
                let dbName = "ecommerce";
                const client = await MongoClient.connect(MONGO_DB, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                let ecommerce = client.db(dbName);
                let resultCategories = await ecommerce
                    .collection("category")
                    .find({ storeId: storeId })
                    .toArray();
                res.render("products", {
                    sort: 1,
                    resultCategories: resultCategories,
                    storeInfo: req.store.userStore,
                    resultProducts: sortedResult,
                });
            }
        }
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/sort",
        });
    }
}

module.exports = router;
