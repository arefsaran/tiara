const express = require("express");
const router = express.Router();

router.get("/", storeInfo);

async function storeInfo(req, res, next) {
    try {
        let storeInfo = req.store;
        res.render("storeInfo", {
            storeInfo: req.store,
            storeDetails: storeInfo,
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
