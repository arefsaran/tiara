const express = require("express");
const router = express.Router();
const { Purchase } = require("../models/purchase");

router.get("/", purchasesView);

async function purchasesView(req, res, next) {
    try {
        let storeId = req.user.userStore.storeId;
        let resultPurchases = await Purchase.find({
            storeId: storeId,
        }).sort({ _id: -1 });
        res.render("purchasesView", {
            storeInfo: req.user.userStore,
            resultPurchases: resultPurchases,
        });
        next();
    } catch (error) {
        res.json({
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
        });
    }
}

module.exports = router;
