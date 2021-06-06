const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Admin, validateLogin, validate } = require("../models/admin");

router.get("/", adminView);
router.post("/", adminLogin);
router.put("/", adminSignUp);

async function adminView(req, res, next) {
    try {
        res.render("adminLogIn", { error: "" });
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

async function adminLogin(req, res, next) {
    try {
        const { error } = validateLogin({
            email: req.body.email.toLowerCase(),
            password: req.body.password,
        });
        if (error) {
            res.render("adminLogIn", {
                error: `${error}`,
            });
        } else {
            let admin = await Admin.findOne({
                email: req.body.email.toLowerCase(),
            });
            if (!admin) {
                res.render("adminLogIn", {
                    error: "نام کاربری یا رمز عبور اشتباه است",
                });
            } else {
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    admin.password
                );
                if (validPassword) {
                    const token = admin.generateAuthToken();
                    // res.render("dashboard", {
                    //     adminToken: token,
                    // });
                    // res.redirect(`/dashboard?adminToken=${token}`);
                    res.render("adminLogIn", {
                        error: token,
                    });
                } else {
                    res.render("adminLogIn", {
                        error: "نام کاربری یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        res.render("adminLogIn", {
            error: `${error}`,
        });
    }
}

async function adminSignUp(req, res, next) {
    try {
        const { error } = validate(req.body);
        let { firstName, lastName, email, password } = req.body;
        if (error) {
            return res.json({
                error: `${error}`,
            });
        } else {
            let AdminWithThisEmail = await Admin.findOne({
                email: email.toLowerCase(),
            });
            if (AdminWithThisEmail) {
                return res.json({
                    error: "با این ایمیل قبلا ثبت نام شده است",
                });
            } else {
                let admin = new Admin({
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                    email: email.toLowerCase(),
                    password: password,
                });
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
                await admin.save();
                const token = admin.generateAuthToken();
                return res.json({
                    adminToken: token,
                });
            }
        }
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
