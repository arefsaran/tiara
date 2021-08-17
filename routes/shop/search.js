const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", searchAPI);

async function searchAPI(request, response, next) {
    try {
        let storeId = request.store.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let resultCategories = await databaseClient
            .collection("categories")
            .find({ storeId: storeId })
            .toArray();
        let { productNameForSearch, productIdForSearch } = request.query;
        let query = { _id: ObjectId(productIdForSearch) };
        let totalResult = [];
        searchInCollection(storeId);
        // getCollectionsName();
        // function getCollectionsName(){
        //     mongoose.connection.db.listCollections().toArray(selectCollection);
        // }
        // function selectCollection(err, collectionsNamesList){
        //     for (let index = 0; index < collectionsNamesList.length; index++) {
        //         let collectionName = collectionsNamesList[index].name;
        //         if(collectionName != "categories" && collectionName != "Stores") {
        //             mongoose.connection.db.collection(collectionName, searchInCollection);
        //         }
        //     }
        // }
        // function searchInCollection(err, collection) {
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
                        .toArray(resultFunction);
                    // collection.find({ $text:{ $search: `\"${productNameForSearch}\"` } }).project({ score: { $meta: "textScore" } }).sort( { score: { $meta: "textScore" } } ).toArray(resultFunction);
                });
            } else if (productIdForSearch && !productNameForSearch) {
                mongoose.connection.db.collection(storeId, function (
                    err,
                    collection
                ) {
                    collection.find(query).toArray(resultFunction);
                });
            }
        }
        function resultFunction(err, searchResult) {
            try {
                if (err) {
                    console.log(err);
                }
                totalResult.push(searchResult);
                let numberOfCollections = totalResult.length;
                if (numberOfCollections == 1) {
                    totalResult = [].concat.apply([], totalResult);
                    // totalResult = totalResult.filter((x => x));
                    totalResult = totalResult.filter(function (eachResult) {
                        if (eachResult) {
                            return eachResult;
                        }
                    });
                    let { sortBy } = request.body;
                    if (sortBy == "priceLowToHigh") {
                        sortFunctionLowToHigh(
                            "productDetails.productPriceEnglishNumber",
                            totalResult
                        );
                    } else if (sortBy == "priceHighToLow") {
                        sortFunctionHighToLow(
                            "productDetails.productPriceEnglishNumber",
                            totalResult
                        );
                    }
                    response.render("products", {
                        sort: 0,
                        storeInfo: request.store.userStore,
                        resultCategories: resultCategories,
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
                    path: "GET:/search (resultFunction)",
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
let sortFunctionLowToHigh = function (prop, arr) {
    prop = prop.split(".");
    let len = prop.length;

    arr.sort(function (a, b) {
        let i = 0;
        while (i < len) {
            a = a[prop[i]];
            b = b[prop[i]];
            i++;
        }
        if (a < b) {
            return -1;
        } else if (a > b) {
            return 1;
        } else {
            return 0;
        }
    });
    return arr;
};
let sortFunctionHighToLow = function (prop, arr) {
    prop = prop.split(".");
    let len = prop.length;

    arr.sort(function (a, b) {
        let i = 0;
        while (i < len) {
            a = a[prop[i]];
            b = b[prop[i]];
            i++;
        }
        if (a < b) {
            return 1;
        } else if (a > b) {
            return -1;
        } else {
            return 0;
        }
    });
    return arr;
};

module.exports = router;
