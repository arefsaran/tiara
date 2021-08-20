const express = require("express");
const router = express.Router();
const { Purchase } = require("../../models/purchase");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
const momentJalaali = require("moment-jalaali");
const { createInvoice } = require("./createInvoice.js");

router.post("/", inStock);

function inStock(request, response) {
    try {
        let {
            customerName,
            customerPhone,
            customerAddress,
            customerPostalCode,
            purchaseId,
            totalPrice,
            basket,
            done,
        } = request.body;
        let storeId = request.store.userStore.storeId;
        let date = Date.now() / 10 ** 7;
        let newPurchaseId = Math.floor(date + Math.random() * 900000)
            .toString()
            .slice(0, 6);
        Date.prototype.addHours = function (h) {
            this.setTime(this.getTime() + h * 60 * 60 * 1000);
            return this;
        };
        let nowISO = new Date();
        let iranTime = nowISO.addHours(3.5);
        momentJalaali.loadPersian({ usePersianDigits: true });
        let paidTime = momentJalaali(iranTime).format("jYYYY/jMM/jDD HH:mm");
        let coefficient = -1;
        if (done === 0 && purchaseId) {
            coefficient = 1;
            MongoClient.connect(
                DATABASE_ADDRESS,
                { useUnifiedTopology: true },
                function (err, database) {
                    if (err) {
                        return console.log("erroR:", err);
                    }
                    let databaseClient = database.db(DATABASE_NAME);
                    databaseClient
                        .collection("purchases")
                        .findOne({ purchaseId: purchaseId })
                        .then((purchaseResult) => {
                            let resultBasket = purchaseResult.basket;
                            for (
                                let index = 0;
                                index < resultBasket.length;
                                index++
                            ) {
                                let element = resultBasket[index];
                                databaseClient
                                    .collection(storeId)
                                    .findOne({ _id: ObjectId(element.id) })
                                    .then((inStock) => {
                                        databaseClient
                                            .collection(storeId)
                                            .updateOne(
                                                {
                                                    _id: ObjectId(element.id),
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
                        });
                }
            );
            MongoClient.connect(
                DATABASE_ADDRESS,
                { useUnifiedTopology: true },
                function (err, database) {
                    if (err) {
                        return console.log("erroR:", err);
                    }
                    let databaseClient = database.db(DATABASE_NAME);
                    databaseClient
                        .collection("purchases")
                        .deleteOne({ purchaseId: purchaseId })
                        .then((productInStock) => {
                            response.json({
                                status: 200,
                                message:
                                    "The request has succeeded || inStock Changed and Invoices Deleted",
                                data: "Deleted",
                                path: "POST:/purchase",
                            });
                        });
                }
            );
        } else if (!purchaseId) {
            let enoughInStockProducts = [];
            let outOfOrderProducts = [];
            MongoClient.connect(
                DATABASE_ADDRESS,
                { useUnifiedTopology: true },
                async (err, database) => {
                    try {
                        if (err) {
                            return console.log("erroR:", err);
                        }
                        let databaseClient = database.db(DATABASE_NAME);
                        for (let index = 0; index < basket.length; index++) {
                            let element = basket[index];
                            await databaseClient
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
                                        response.json({
                                            status: 403,
                                            message:
                                                "The server understood the request, but is refusing to fulfill it. || productId incorrect",
                                            data: {
                                                productName: element.name,
                                                succeeded: false,
                                            },
                                            path: "POST:/inStock",
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
                                DATABASE_ADDRESS,
                                { useUnifiedTopology: true },
                                function (err, database) {
                                    if (err) {
                                        return console.log("erroR:", err);
                                    }
                                    let databaseClient = database.db(
                                        DATABASE_NAME
                                    );
                                    for (
                                        let index = 0;
                                        index < basket.length;
                                        index++
                                    ) {
                                        let element = basket[index];
                                        databaseClient
                                            .collection(storeId)
                                            .findOne({
                                                _id: ObjectId(element.id),
                                            })
                                            .then((inStock) => {
                                                databaseClient
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
                            databaseClient
                                .collection("purchases")
                                .findOne({ _id: purchaseInvoice._id })
                                .then(() => {
                                    response.json({
                                        status: 200,
                                        message: "The request has succeeded",
                                        data: {
                                            purchaseId: newPurchaseId,
                                            totalPrice: totalPrice,
                                            succeeded: true,
                                        },
                                        path: "POST:/purchase",
                                    });
                                });
                        } else if (outOfOrderProducts.length >= 1) {
                            response.json({
                                status: 403,
                                message:
                                    "The server understood the request, but is refusing to fulfill it. || inStock < count",
                                data: {
                                    outOfOrderProducts: outOfOrderProducts,
                                    succeeded: false,
                                },
                                path: "POST:/inStock",
                            });
                        } else {
                            response.json({
                                status: 403,
                                message:
                                    "The server understood the request, but is refusing to fulfill it. || Database Error",
                                data: {
                                    succeeded: false,
                                },
                                path: "POST:/inStock",
                            });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            );
        } else if (done === 1 && purchaseId) {
            MongoClient.connect(
                DATABASE_ADDRESS,
                { useUnifiedTopology: true },
                function (err, database) {
                    if (err) {
                        return console.log("erroR:", err);
                    }
                    let databaseClient = database.db(DATABASE_NAME);
                    databaseClient
                        .collection("purchases")
                        .findOneAndUpdate(
                            { purchaseId: purchaseId },
                            { $set: { done: 1 } }
                        )
                        .then((purchaseForPDF) => {
                            const invoice = {
                                shipping: {
                                    name:
                                        purchaseForPDF.value
                                            .customerInformations.customerName,
                                    address:
                                        purchaseForPDF.value
                                            .customerInformations
                                            .customerAddress,
                                    phone:
                                        purchaseForPDF.value
                                            .customerInformations.customerPhone,
                                    postalCode:
                                        purchaseForPDF.value
                                            .customerInformations
                                            .customerPostalCode,
                                },
                                items: purchaseForPDF.value.basket,
                                subtotal: purchaseForPDF.value.totalPrice,
                                paidTime: purchaseForPDF.value.paidTime,
                                purchaseId: purchaseForPDF.value.purchaseId,
                            };
                            if (!process.env.PWD) {
                                process.env.PWD = process.cwd();
                            }
                            let invoicePath = `${process.env.PWD}/static/invoices/${purchaseId}.pdf`;
                            // createInvoice(invoice, invoicePath);
                            response.json({
                                status: 200,
                                message:
                                    "The request has succeeded and Purchase is done",
                                data: {
                                    succeeded: true,
                                    RefID: purchaseId,
                                    // invoicePath: invoicePath,
                                },
                                path: "POST:/purchase",
                            });
                        });
                }
            );
        }
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/purchase",
        });
    }
}

module.exports = router;
