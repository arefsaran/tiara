const express = require("express");
const router = express.Router();
const { User, validateLogin } = require("../models/user");
const config = require("config");
const bcrypt = require("bcryptjs");

router.get("/", logInView);
router.post("/", logInFunction);

async function logInView(req, res, next) {
    try {
        res.render("logIn", { error: "" });
        next();
    } catch (error) {
        res.render("logIn", {
            error: `${error}`,
        });
    }
}

async function logInFunction(req, res, next) {
    try {
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
                    res.redirect(`/dashboard?userToken=${token}`);
                } else {
                    res.render("logIn", {
                        error: "ایمیل یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        res.render("logIn", {
            error: `${error}`,
        });
    }
}

module.exports = router;
