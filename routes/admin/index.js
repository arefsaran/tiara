const express = require("express");
const router = express.Router();
const { adminAuth } = require("../../middlewares/adminAuth");
const { signup } = require("./signup");
const { loginView, login } = require("./login");
const { view } = require("./dashboard");
const { users } = require("./purchase");

router.get("/", loginView);
router.post("/", login);
router.put("/", signup);
router.get("/dashboard", adminAuth, view);
router.get("/purchase", adminAuth, users);

module.exports = router;
