const express = require("express");
const router = express.Router();
const { User, validateLogin } = require("../../models/user");
const bcrypt = require("bcryptjs");

router.get("/", logInView);
router.post("/", logInFunction);

async function logInView(req, res, next) {
    try {
        res.render("logIn", { error: "" });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/logIn",
        });
    }
}

async function logInFunction(req, res, next) {
    try {
        if (req.body.userEmail === "enamad") {
            req.body.userEmail = "enamad@gmail.com";
        }
        const { error } = validateLogin({
            userEmail: req.body.userEmail.toLowerCase(),
            userPassword: req.body.userPassword,
        });
        if (error) {
            res.render("logIn", {
                error: `${error}`,
            });
        } else {
            let user = await User.findOne({
                userEmail: req.body.userEmail.toLowerCase(),
            });
            if (!user) {
                res.render("logIn", {
                    error: "ایمیل یا رمز عبور اشتباه است",
                });
            } else {
                const validPassword = await bcrypt.compare(
                    req.body.userPassword,
                    user.userPassword
                );
                if (validPassword) {
                    const token = user.generateAuthToken();
                    // res.render("dashboard", {
                    //     userToken: token,
                    // });
                    res.redirect(`/user/dashboard?userToken=${token}`);
                } else {
                    res.render("logIn", {
                        error: "ایمیل یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/logIn",
        });
    }
}

module.exports = router;
