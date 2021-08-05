const express = require("express");
const router = express.Router();
const { User, validateLogin } = require("../../models/user");
const bcrypt = require("bcryptjs");

router.get("/", logInView);
router.post("/", logInFunction);

async function logInView(request, response, next) {
    try {
        response.render("logIn", { error: "" });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/logIn",
        });
    }
}

async function logInFunction(request, response, next) {
    try {
        if (request.body.userEmail === "enamad") {
            request.body.userEmail = "enamad@gmail.com";
        }
        const { error } = validateLogin({
            userEmail: request.body.userEmail.toLowerCase(),
            userPassword: request.body.userPassword,
        });
        if (error) {
            response.render("logIn", {
                error: `${error}`,
            });
        } else {
            let user = await User.findOne({
                userEmail: request.body.userEmail.toLowerCase(),
            });
            if (!user) {
                response.render("logIn", {
                    error: "ایمیل یا رمز عبور اشتباه است",
                });
            } else {
                const validPassword = await bcrypt.compare(
                    request.body.userPassword,
                    user.userPassword
                );
                if (validPassword) {
                    const token = user.generateAuthToken();
                    // response.render("dashboard", {
                    //     userToken: token,
                    // });
                    response.redirect(`/user/dashboard?userToken=${token}`);
                } else {
                    response.render("logIn", {
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
            address: "POST:/user/logIn",
        });
    }
}

module.exports = router;
