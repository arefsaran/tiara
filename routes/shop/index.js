const express = require("express");
const router = express.Router();
const { subDomainChecker } = require("../../middlewares/subDomainChecker");
const home = require("./home");
const storeInfo = require("./storeInfo");
const productsPage = require("./productsPage");
const productPage = require("./productPage");
const search = require("./search");
const sort = require("./sort");
const support = require("./support");
const purchase = require("./purchase");
const basket = require("./basket");
const zarinpal = require("./zarinpal");
const customerInfo = require("./customerInfo");

router.use("/", subDomainChecker, home);
router.use("/storeInfo", subDomainChecker, storeInfo);
router.use("/productsPage", subDomainChecker, productsPage);
router.use("/productPage", subDomainChecker, productPage);
router.use("/search", subDomainChecker, search);
router.use("/sort", subDomainChecker, sort);
router.use("/support", subDomainChecker, support);
router.use("/purchase", subDomainChecker, purchase);
router.use("/basket", subDomainChecker, basket);
router.use("/zarinpal", zarinpal);
router.use("/customerInfo", customerInfo);

module.exports = router;
