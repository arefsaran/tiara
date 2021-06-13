const express = require("express");
const router = express.Router();
const { auth } = require("../../middlewares/auth");
const signUp = require("./signUp");
const logIn = require("./logIn");
const dashboard = require("./dashboard");
const settings = require("./settings");
const purchasesView = require("./purchasesView");
const uploadProduct = require("./uploadProduct");
const editProduct = require("./editProduct");
const editProducts = require("./editProducts");
const editHome = require("./editHome");
const deleteProduct = require("./deleteProduct");

router.use("/signUp", signUp);
router.use("/logIn", logIn);
router.use("/dashboard", auth, dashboard);
router.use("/settings", auth, settings);
router.use("/purchasesView", auth, purchasesView);
router.use("/uploadProduct", auth, uploadProduct);
router.use("/editProduct", auth, editProduct);
router.use("/editProducts", auth, editProducts);
router.use("/editHome", auth, editHome);
router.use("/deleteProduct", auth, deleteProduct);

module.exports = router;
