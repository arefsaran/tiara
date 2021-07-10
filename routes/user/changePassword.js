const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
let ObjectId = require("mongodb").ObjectID;
const mongoose = require("mongoose");
const { User } = require("../../models/user");

router.get("/", changePasswordView);
router.post("/", changePassword);

async function changePasswordView(req, res, next) {
    try {
        let storeInfo = req.user.userStore;
        const token = req.query.userToken || req.query.userTokenHide;
        res.render("changePassword", {
            error: "",
            passwordChanged: 0,
            token: token,
            storeInfo: storeInfo,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/changePassword",
        });
    }
}
async function changePassword(req, res, next) {
    try {
        let { oldPassword, newPassword, newPassword2 } = req.body;
        const token = req.query.userToken;
        if (newPassword === newPassword2) {
            if (newPassword.length > 3) {
                let user = req.user;
                if (user.userPassword.length > 0) {
                    const validPassword = await bcrypt.compare(
                        oldPassword,
                        user.userPassword
                    );
                    if (validPassword == true) {
                        const salt = await bcrypt.genSalt(10);
                        let newHash = await bcrypt.hash(newPassword, salt);
                        await User.findOneAndUpdate(
                            { _id: ObjectId(user._id) },
                            { $set: { userPassword: newHash } }
                        );
                        res.render("changePassword", {
                            error: "",
                            passwordChanged: 1,
                            token: token,
                            storeInfo: storeInfo,
                        });
                    } else {
                        res.render("changePassword", {
                            error: "رمز عبور قدیمی اشتباه است.",
                            passwordChanged: 0,
                            token: token,
                            storeInfo: storeInfo,
                        });
                    }
                }
            } else {
                res.render("changePassword", {
                    error: "رمزعبور باید حداقل 4 کاراکتر باشد.",
                    passwordChanged: 0,
                    token: token,
                    storeInfo: storeInfo,
                });
            }
        } else {
            res.render("changePassword", {
                error: "رمزعبور جدید را درست تکرار کنید.",
                passwordChanged: 0,
                token: token,
                storeInfo: storeInfo,
            });
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/changePassword",
        });
    }
}

module.exports = router;
