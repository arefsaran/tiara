const express = require("express");
const router = express.Router();

router.get("/", adminFunc);

async function adminFunc(req, res, next) {
    try {
        res.render("admin");
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
