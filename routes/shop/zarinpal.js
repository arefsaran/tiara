const request = require("request-promise");
const express = require("express");
const app = express.Router();
const { MERCHANT_ID } = require("../../config/config");
const { subDomainChecker } = require("../../middlewares/subDomainChecker");

function getUrlOption(url, params) {
    return {
        method: "POST",
        uri: url,
        headers: {
            "cache-control": "no-cache",
            "content-type": "application/json",
        },
        body: params,
        json: true,
    };
}

app.get("/payment", subDomainChecker, pay);
app.get("/checker", checker);

async function pay(req, res) {
    try {
        let { totalPrice, purchaseId } = req.query;
        if (!process.env.PWD) {
            process.env.PWD = process.cwd();
        }
        let invoicePath = `/invoices/${purchaseId}.pdf`;
        let store = req.store.userStore.storeId;
        let shippingCost = req.store.userStore.shippingCost * 1000 || 0;
        let amount = parseInt(totalPrice) + shippingCost;
        let userEmail = req.store.userEmail || "tiaraplatform@gmail.com";
        let Zarinpal_MERCHANT_ID = req.store.MERCHANT_ID || MERCHANT_ID;
        let params = {
            MerchantID: Zarinpal_MERCHANT_ID,
            Amount: amount,
            CallbackURL: `https://${store}.tiaraplatform.ir/zarinpal/checker?Amount=${amount}&invoicePath=${invoicePath}&purchaseId=${purchaseId}&storeId=${store}`,
            Description: `${purchaseId}`,
            Email: userEmail,
        };

        let options = getUrlOption(
            "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
            params
        );

        await request(options)
            .then(async (data) => {
                return res.redirect(
                    `https://www.zarinpal.com/pg/StartPay/${data.Authority}`
                );
            })
            .catch((err) => res.json(err.message));
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/zarinpal/payment",
        });
    }
}

async function checker(req, res, next) {
    try {
        let paramsPuchase = {
            done: 0,
            purchaseId: req.query.purchaseId,
        };
        let requestURL = `https://${req.query.storeId}.tiaraplatform.ir/purchase`;
        let optionsPurchase = getUrlOption(requestURL, paramsPuchase);
        if (req.query.Status !== "OK") {
            request(optionsPurchase).then(async (data) => {
                return res.render("unsuccessfulPayment");
            });
        } else {
            let params = {
                MerchantID: MERCHANT_ID,
                Amount: req.query.Amount,
                Authority: req.query.Authority,
            };

            let options = getUrlOption(
                "https://www.zarinpal.com/pg/rest/WebGate/PaymentVerification.json",
                params
            );

            request(options)
                .then(async (data) => {
                    if (data.Status == 100) {
                        let params = {
                            done: 1,
                            purchaseId: req.query.purchaseId,
                        };
                        let requestURL = `https://${req.query.storeId}.tiaraplatform.ir/purchase`;
                        let options = getUrlOption(requestURL, params);
                        request(options).then(async (result) => {
                            return res.render("successfulPayment", {
                                RefID: result.data.RefID,
                                invoicePath: req.query.invoicePath,
                            });
                        });
                    } else {
                        request(optionsPurchase).then(async (data) => {
                            return res.render("unsuccessfulPayment");
                        });
                    }
                })
                .catch((err) => {
                    request(optionsPurchase).then(async (data) => {
                        return res.render("unsuccessfulPayment");
                    });
                });
        }
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/zarinpal/checker",
        });
    }
}

module.exports = app;