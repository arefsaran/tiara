const express = require("express");
const router = express.Router();

router.get("/", supportView);

async function supportView(req, res, next) {
    try {
        res.render("support", { storeInfo: req.store });
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
