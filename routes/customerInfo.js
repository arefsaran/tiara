const express = require("express");
const router = express.Router();

router.get("/", customerInfoView);

async function customerInfoView(req, res, next) {
    try {
        let { error } = req.query;
        // console.log(error);
        if (error) {
            res.render("customerInfo", { storeInfo: req.store, error: error });
        } else {
            res.render("customerInfo", { storeInfo: req.store, error: "" });
        }
        next();
    } catch (error) {
        res.render("customerInfo", { storeInfo: req.store, error: error });
    }
}

module.exports = router;
