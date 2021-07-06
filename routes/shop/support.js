const express = require("express");
const router = express.Router();

router.get("/", supportView);

async function supportView(req, res, next) {
    try {
        res.render("support", { storeInfo: req.store.userStore });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/support",
        });
    }
}

module.exports = router;
