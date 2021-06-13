const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;

router.get("/", searchAPI);

function searchAPI(req, res) {
    try {
        let { productNameForSearch, productIdForSearch } = req.query;
        let storeId = req.store.storeId;
        let query = { _id: ObjectId(productIdForSearch) };
        let totalResult = [];
        searchInCollection(storeId);
        // getCollectionsName();
        // // console.log("totalResult",totalResult)
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
            // console.log(typeof(storeId));
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
                    // console.log(totalResult);
                    let { sortBy } = req.body;
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
                    // totalResult = totalResult.flat(1);
                    // console.log("totalResult",totalResult)
                    // res.json({
                    //     status: 200,
                    //     message: "The request has succeeded",
                    //     data: {
                    //         listOfProducts: totalResult,
                    //     },
                    //     address: "POST:/search",
                    // });
                    res.render("products", {
                        storeInfo: req.store,
                        resultProducts: totalResult,
                        error: "",
                    });
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    } catch (error) {
        res.json({
            status: 400,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/",
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
