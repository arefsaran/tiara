const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", search);

async function search(request, response, next) {
    try {
        let storeId = request.store.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection("categories")
            .find({ storeId: storeId })
            .toArray();
        let { productNameForSearch, productIdForSearch } = request.query;
        let query = { _id: ObjectId(productIdForSearch) };
        let totalResult = [];
        searchInCollection(storeId);
        function searchInCollection(storeId) {
            if (productNameForSearch && !productIdForSearch) {
                mongoose.connection.db.collection(storeId, function (
                    err,
                    collection
                ) {
                    collection
                        .find({
                            productName: { $regex: productNameForSearch },
                            inStock: { $gt: 0 },
                        })
                        .toArray(result);
                    // collection.find({ $text:{ $search: `\"${productNameForSearch}\"` } }).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(result);
                });
            } else if (productIdForSearch && !productNameForSearch) {
                mongoose.connection.db.collection(storeId, function (
                    err,
                    collection
                ) {
                    collection.find(query).toArray(result);
                });
            }
        }
        function result(err, searchResult) {
            try {
                if (err) {
                    console.log(err);
                }
                totalResult.push(searchResult);
                let collectionsNumber = totalResult.length;
                if (collectionsNumber == 1) {
                    totalResult = [].concat.apply([], totalResult);
                    // totalResult = totalResult.filter((x => x));
                    totalResult = totalResult.filter(function (eachResult) {
                        if (eachResult) {
                            return eachResult;
                        }
                    });
                    let { sortBy } = request.body;
                    if (sortBy == "priceLowToHigh") {
                        sortLowToHigh(
                            "productDetails.productPriceEnglishNumber",
                            totalResult
                        );
                    } else if (sortBy == "priceHighToLow") {
                        sortHighToLow(
                            "productDetails.productPriceEnglishNumber",
                            totalResult
                        );
                    }
                    response.render("products", {
                        sort: 0,
                        storeInfo: request.store.userStore,
                        categories: categories,
                        resultProducts: totalResult,
                        error: "",
                    });
                }
            } catch (error) {
                response.json({
                    status: 500,
                    message:
                        "The request could not be understood by the server",
                    data: { error: error },
                    path: "GET:/search (result)",
                });
            }
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/search",
        });
    }
}
let sortLowToHigh = function (property, array) {
    property = property.split(".");
    let length = property.length;

    array.sort(function (a, b) {
        let counter = 0;
        while (counter < length) {
            a = a[property[counter]];
            b = b[property[counter]];
            counter++;
        }
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    return array;
};
let sortHighToLow = function (property, array) {
    property = property.split(".");
    let length = property.length;

    array.sort(function (a, b) {
        let counter = 0;
        while (counter < length) {
            a = a[property[counter]];
            b = b[property[counter]];
            counter++;
        }
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
    return array;
};

module.exports = router;
