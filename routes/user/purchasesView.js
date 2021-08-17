const express = require("express");
const router = express.Router();
const { Purchase } = require("../../models/purchase");

router.get("/", purchasesView);

async function purchasesView(request, response, next) {
    try {
        let storeId = request.user.userStore.storeId;
        let resultPurchases = await Purchase.find({
            storeId: storeId,
            done: 1,
        }).sort({ _id: -1 });
        response.render("purchasesView", {
            storeInfo: request.user.userStore,
            resultPurchases: resultPurchases,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/purchasesView",
        });
    }
}

module.exports = router;
