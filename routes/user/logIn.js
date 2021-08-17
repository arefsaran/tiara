const express = require("express");
const router = express.Router();
const { User, validateLogin } = require("../../models/user");
const bcrypt = require("bcryptjs");

router.get("/", loginView);
router.post("/", loginFunction);

async function loginView(request, response, next) {
    try {
        response.render("login", { error: "" });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/login",
        });
    }
}

async function loginFunction(request, response, next) {
    try {
        const { error } = validateLogin({
            userEmail: request.body.userEmail.toLowerCase(),
            userPassword: request.body.userPassword,
        });
        if (error) {
            response.render("login", {
                error: `${error}`,
            });
        } else {
            let user = await User.findOne({
                userEmail: request.body.userEmail.toLowerCase(),
            });
            if (!user) {
                response.render("login", {
                    error: "ایمیل یا رمز عبور اشتباه است",
                });
            } else {
                const isValidPassword = await bcrypt.compare(
                    request.body.userPassword,
                    user.userPassword
                );
                if (isValidPassword) {
                    const token = user.generateAuthToken();
                    // response.render("dashboard", {
                    //     userToken: token,
                    // });
                    response.redirect(`/user/dashboard?userToken=${token}`);
                } else {
                    response.render("login", {
                        error: "ایمیل یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/login",
        });
    }
}

module.exports = router;
