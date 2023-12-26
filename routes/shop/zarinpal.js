// const requestPromise = require("request-promise");
const requestPromise = null;
const express = require("express");
const app = express.Router();
const { MERCHANT_ID } = require("../../config/config");
const { subDomainChecker } = require("../../middlewares/subDomainChecker");

function getUrlOption(url, parameters) {
    return {
        method: "POST",
        uri: url,
        headers: {
            "cache-control": "no-cache",
            "content-type": "application/json",
        },
        body: parameters,
        json: true,
    };
}

app.get("/payment", subDomainChecker, pay);
app.get("/checker", checker);

async function pay(request, response, next) {
    try {
        let { totalPrice, purchaseId } = request.query;
        if (!process.env.PWD) {
            process.env.PWD = process.cwd();
        }
        let invoicePath = `/invoices/${purchaseId}.pdf`;
        let storeId = request.store.userStore.storeId;
        let domain = request.store.userStore.domain;
        let callbackURL = "";
        let shippingCost = request.store.userStore.shippingCost * 1000 || 0;
        let amount = parseInt(totalPrice) + shippingCost;
        if (domain.length == 0) {
            callbackURL = `https://${storeId}.tiaraplatform.ir/zarinpal/checker?Amount=${amount}&invoicePath=${invoicePath}&purchaseId=${purchaseId}&storeId=${storeId}`;
        } else if (domain.length >= 1) {
            callbackURL = `http://${domain}/zarinpal/checker?Amount=${amount}&invoicePath=${invoicePath}&purchaseId=${purchaseId}&storeId=${storeId}`;
        }
        let userEmail = request.store.userEmail || "tiaraplatform@gmail.com";
        let ZARINPAL_MERCHANT_ID = request.store.MERCHANT_ID || MERCHANT_ID;
        let parameters = {
            MerchantID: ZARINPAL_MERCHANT_ID,
            Amount: amount,
            CallbackURL: callbackURL,
            Description: `${purchaseId}`,
            Email: userEmail,
        };
        let options = getUrlOption(
            "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
            parameters
        );

        await requestPromise(options)
            .then(async (data) => {
                return response.redirect(
                    `https://www.zarinpal.com/pg/StartPay/${data.Authority}`
                );
            })
            .catch((err) => response.json(err.message));
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/zarinpal/payment",
        });
    }
}

function checker(request, response) {
    try {
        let purchaseParameters = {
            done: 0,
            purchaseId: request.query.purchaseId,
        };
        let storeId = request.query.storeId;
        let requestURL = "";
        let domain = request.store.userStore.domain;
        if (domain.length == 0) {
            requestURL = `https://${storeId}.tiaraplatform.ir/purchase`;
        } else if (domain.length >= 1) {
            requestURL = `http://${domain}/purchase`;
        }
        let optionsPurchase = getUrlOption(requestURL, purchaseParameters);
        if (request.query.Status !== "OK") {
            requestPromise(optionsPurchase).then(async (data) => {
                return response.render("unsuccessfulPayment");
            });
        } else {
            let parameters = {
                MerchantID: MERCHANT_ID,
                Amount: request.query.Amount,
                Authority: request.query.Authority,
            };

            let options = getUrlOption(
                "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
                parameters
            );

            requestPromise(options)
                .then(async (data) => {
                    if (data.Status == 100) {
                        let parameters = {
                            done: 1,
                            purchaseId: request.query.purchaseId,
                        };
                        let requestURL = "";
                        if (domain.length == 0) {
                            requestURL = `https://${storeId}.tiaraplatform.ir/purchase`;
                        } else if (domain.length >= 1) {
                            requestURL = `http://${domain}/purchase`;
                        }
                        let options = getUrlOption(requestURL, parameters);
                        requestPromise(options).then(async (result) => {
                            return response.render("successfulPayment", {
                                RefID: request.query.purchaseId,
                                invoicePath: request.query.invoicePath,
                            });
                        });
                    } else {
                        requestPromise(optionsPurchase).then(async (data) => {
                            return response.render("unsuccessfulPayment");
                        });
                    }
                })
                .catch((err) => {
                    requestPromise(optionsPurchase).then(async (data) => {
                        return response.render("unsuccessfulPayment");
                    });
                });
        }
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/zarinpal/checker",
        });
    }
}

module.exports = app;
