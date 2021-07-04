const express = require("express");
const router = express.Router();
const { Purchase } = require("../../models/purchase");

router.get("/", purchasesView);

async function purchasesView(req, res, next) {
    try {
        let storeId = req.user.userStore.storeId;
        let resultPurchases = await Purchase.find({
            storeId: storeId,
            done: 1,
        }).sort({ _id: -1 });
        res.render("purchasesView", {
            storeInfo: req.user.userStore,
            resultPurchases: resultPurchases,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/purchasesView",
        });
    }
}

module.exports = router;
