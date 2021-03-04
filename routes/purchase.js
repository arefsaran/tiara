const express = require("express");
const router = express.Router();
const { Purchase } = require("../models/purchase");
const config = require("config");
const { json } = require("express");
const serverConfig = config.get("serverConfig.config");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const url = serverConfig.ecommerceDB;
const momentJalaali = require("moment-jalaali");

router.post("/", inStockAPI);

function inStockAPI(req, res) {
    try {
        // console.log(req.body);
        let {
            customerName,
            customerPhone,
            customerAddress,
            customerPostalCode,
            purchaseId,
            totalPrice,
            basket,
        } = req.body;
        let storeId = req.store.storeId;
        // let basket = [];
        // basketJSON = JSON.parse(basketJSON);
        // for (let inCart in basketJSON) {
        //     let item = basketJSON[inCart];
        //     basket.push(item);
        // }
        // console.log(typeof basket, basket.length);
        let date = Date.now() / 10 ** 7;
        let newPurchaseId = Math.floor(date + Math.random() * 900000)
            .toString()
            .slice(0, 6);
        let nowISO = new Date();
        momentJalaali.loadPersian({ usePersianDigits: true });
        let paidTime = momentJalaali(nowISO).format("jYYYY/jMM/jDD HH:mm");
        let coefficient = -1;
        if (purchaseId) {
            coefficient = 1;
            MongoClient.connect(url, { useUnifiedTopology: true }, function (
                err,
                database
            ) {
                if (err) {
                    return console.log("erroR:", err);
                }
                let ecommerceDatabase = database.db("ecommerce");
                for (let index = 0; index < basket.length; index++) {
                    let element = basket[index];
                    ecommerceDatabase
                        .collection(storeId)
                        .findOne({ _id: ObjectId(element.id) })
                        .then((inStock) => {
                            ecommerceDatabase.collection(storeId).updateOne(
                                {
                                    _id: ObjectId(element.id),
                                },
                                {
                                    $inc: {
                                        inStock: element.count * coefficient,
                                    },
                                }
                            );
                        });
                }
            });
            MongoClient.connect(url, { useUnifiedTopology: true }, function (
                err,
                database
            ) {
                if (err) {
                    return console.log("erroR:", err);
                }
                let ecommerceDatabase = database.db("ecommerce");
                ecommerceDatabase
                    .collection("purchases")
                    .deleteOne({ purchaseId: purchaseId })
                    .then((productInStock) => {
                        res.json({
                            status: 200,
                            message:
                                "The request has succeeded || inStock Changed and Invoices Deleted",
                            data: "Deleted",
                            address: "POST:/purchase",
                        });
                    });
            });
        } else if (!purchaseId) {
            let enoughInStockProducts = [];
            let outOfOrderProducts = [];
            MongoClient.connect(
                url,
                { useUnifiedTopology: true },
                async (err, database) => {
                    try {
                        if (err) {
                            return console.log("erroR:", err);
                        }
                        let ecommerceDatabase = database.db("ecommerce");
                        for (let index = 0; index < basket.length; index++) {
                            let element = basket[index];
                            await ecommerceDatabase
                                .collection(storeId)
                                .findOne({ _id: ObjectId(element.id) })
                                .then((productInStock) => {
                                    if (
                                        productInStock.inStock >= element.count
                                    ) {
                                        enoughInStockProducts.push(element);
                                    } else if (
                                        productInStock.inStock < element.count
                                    ) {
                                        outOfOrderProducts.push(element);
                                    } else {
                                        res.json({
                                            status: 403,
                                            message:
                                                "The server understood the request, but is refusing to fulfill it. || productId incorrect",
                                            data: {
                                                productName: element.name,
                                                succeeded: false,
                                            },
                                            address: "POST:/inStock",
                                        });
                                    }
                                });
                        }
                        if (
                            enoughInStockProducts.length >= 1 &&
                            outOfOrderProducts.length == 0
                        ) {
                            let purchaseInvoice = new Purchase({
                                totalPrice: totalPrice,
                                storeId: storeId,
                                paidTime: paidTime,
                                purchaseId: newPurchaseId,
                                basket: basket,
                                customerInformations: {
                                    customerAddress: customerAddress,
                                    customerPhone: customerPhone,
                                    customerPostalCode: customerPostalCode,
                                    customerName: customerName,
                                },
                            });
                            purchaseInvoice.save();
                            MongoClient.connect(
                                url,
                                { useUnifiedTopology: true },
                                function (err, database) {
                                    if (err) {
                                        return console.log("erroR:", err);
                                    }
                                    let ecommerceDatabase = database.db(
                                        "ecommerce"
                                    );
                                    for (
                                        let index = 0;
                                        index < basket.length;
                                        index++
                                    ) {
                                        let element = basket[index];
                                        ecommerceDatabase
                                            .collection(storeId)
                                            .findOne({
                                                _id: ObjectId(element.id),
                                            })
                                            .then((inStock) => {
                                                ecommerceDatabase
                                                    .collection(storeId)
                                                    .updateOne(
                                                        {
                                                            _id: ObjectId(
                                                                element.id
                                                            ),
                                                        },
                                                        {
                                                            $inc: {
                                                                inStock:
                                                                    element.count *
                                                                    coefficient,
                                                            },
                                                        }
                                                    );
                                            });
                                    }
                                }
                            );
                            ecommerceDatabase
                                .collection("purchases")
                                .findOne({ _id: purchaseInvoice._id })
                                .then(() => {
                                    res.json({
                                        status: 200,
                                        message: "The request has succeeded",
                                        data: {
                                            purchaseId: newPurchaseId,
                                            totalPrice: totalPrice,
                                            succeeded: true,
                                        },
                                        address: "POST:/purchase",
                                    });
                                });
                        } else if (outOfOrderProducts.length >= 1) {
                            res.json({
                                status: 403,
                                message:
                                    "The server understood the request, but is refusing to fulfill it. || inStock < count",
                                data: {
                                    outOfOrderProducts: outOfOrderProducts,
                                    succeeded: false,
                                },
                                address: "POST:/inStock",
                            });
                        } else {
                            res.json({
                                status: 403,
                                message:
                                    "The server understood the request, but is refusing to fulfill it. || Database Error",
                                data: {
                                    succeeded: false,
                                },
                                address: "POST:/inStock",
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        }
    } catch (error) {
        res.json({
            status: 400,
            message: "The request could not be understood by the server",
            data: {
                error: error,
                succeeded: false,
            },
            address: "POST:/inStock",
        });
    }
}

module.exports = router;
