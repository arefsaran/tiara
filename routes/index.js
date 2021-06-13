const express = require("express");
const router = express.Router();
const shop = require("./shop/index");
const admin = require("./admin/index");
const user = require("./user/index");

router.use("/", shop);
router.use("/admin", admin);
router.use("/user", user);

module.exports = router;
