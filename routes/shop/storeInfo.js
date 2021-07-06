const express = require("express");
const router = express.Router();

router.get("/", storeInfo);

async function storeInfo(req, res, next) {
    try {
        let storeInfo = req.store.userStore;
        res.render("storeInfo", {
            storeInfo: req.store.userStore,
            storeDetails: storeInfo,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/storeInfo",
        });
    }
}

module.exports = router;
