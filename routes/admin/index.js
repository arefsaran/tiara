const express = require("express");
const router = express.Router();
const { adminAuth } = require("../../middlewares/adminAuth");
const { adminSignUp } = require("./signUp");
const { adminlogInView, adminLogin } = require("./logIn");
const { adminDashboardView } = require("./dashboard");
const { usersView } = require("./purchase");

router.get("/", adminlogInView);
router.post("/", adminLogin);
router.put("/", adminSignUp);
router.get("/dashboard", adminAuth, adminDashboardView);
router.get("/purchase", adminAuth, usersView);

module.exports = router;
