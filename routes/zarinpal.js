const request = require("request-promise");
const express = require("express");
const app = express.Router();
const mongoose = require("mongoose");
const { Purchase } = require("../models/purchase");
const { subDomainChecker } = require("../middlewares/subDomainChecker");

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
        let store = req.store.storeId;
        let params = {
            MerchantID: "c1b685fb-429a-436f-be23-99a03900f621",
            Amount: totalPrice,
            CallbackURL: `https://${store}.tiaraplatform.ir/zarinpal/checker?Amount=${totalPrice}`,
            Description: `${purchaseId}`,
            Email: "tiaraplatform@gmail.com",
        };

        let options = getUrlOption(
            "https://www.zarinpal.com/pg/rest/WebGate/PaymentRequest.json",
            params
        );

        request(options)
            .then(async (data) => {
                return res.redirect(
                    `https://www.zarinpal.com/pg/StartPay/${data.Authority}`
                );
            })
            .catch((err) => res.json(err.message));
    } catch (err) {
        res.json({
            status: 400,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/zarinpal/payment",
        });
    }
}

async function checker(req, res, next) {
    try {
        if (req.query.Status !== "OK") {
            res.render("unsuccessfulPayment");
        } else {
            let params = {
                MerchantID: "c1b685fb-429a-436f-be23-99a03900f621",
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
                        res.render("successfulPayment", { RefID: data.RefID });
                    } else {
                        res.render("unsuccessfulPayment");
                    }
                })
                .catch((err) => {
                    res.render("unsuccessfulPayment");
                });
        }
    } catch (err) {
        res.json({
            status: 400,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/zarinpal/checker",
        });
    }
}

module.exports = app;
