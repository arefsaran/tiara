const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

router.post("/", sortAPI);

function sortAPI(req, res) {
    try {
        let { collectionName, sortBy } = req.body;
        let storeId = req.store.storeId;
        if (sortBy == "priceLowToHigh") {
            sortBy = { "productDetails.productPriceEnglishNumber": 1 };
        } else if (sortBy == "priceHighToLow") {
            sortBy = { "productDetails.productPriceEnglishNumber": -1 };
        }
        findFunction(collectionName, storeId);
        function findFunction(collectionName, name) {
            mongoose.connection.db.collection(name, function (err, collection) {
                collection
                    .find({
                        productType: collectionName,
                        inStock: { $gt: 0 },
                    })
                    .sort(sortBy)
                    .toArray(showSorted);
            });
        }
        function showSorted(err, sortedResult) {
            if (err) {
                console.log(err);
            } else {
                res.json({
                    status: 200,
                    message: "The request has succeeded",
                    data: {
                        listOfProducts: sortedResult,
                    },
                    address: "POST:/search",
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
