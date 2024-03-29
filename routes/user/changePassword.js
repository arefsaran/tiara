const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
let ObjectId = require("mongodb").ObjectID;
const { User } = require("../../models/user");

router.get("/", changePasswordView);
router.post("/", changePassword);

async function changePasswordView(request, response, next) {
    try {
        let storeInfo = request.user.userStore;
        const token = request.query.userToken || request.query.userTokenHide;
        response.render("changePassword", {
            error: "",
            isPasswordChange: 0,
            token: token,
            storeInfo: storeInfo,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/changePassword",
        });
    }
}
async function changePassword(request, response, next) {
    try {
        let { oldPassword, newPassword, newPasswordConfirm } = request.body;
        const token = request.query.userToken;
        let storeInfo = request.user.userStore;
        if (newPassword === newPasswordConfirm && newPassword.length > 3) {
            let user = request.user;
            const isValidPassword = await bcrypt.compare(
                oldPassword,
                user.userPassword
            );
            if (isValidPassword == true) {
                const salt = await bcrypt.genSalt(10);
                let newHash = await bcrypt.hash(newPassword, salt);
                await User.findOneAndUpdate(
                    { _id: ObjectId(user._id) },
                    { $set: { userPassword: newHash } }
                );
                response.render("changePassword", {
                    error: "",
                    isPasswordChange: 1,
                    token: token,
                    storeInfo: storeInfo,
                });
            } else {
                response.render("changePassword", {
                    error: "رمز عبور قدیمی اشتباه است.",
                    isPasswordChange: 0,
                    token: token,
                    storeInfo: storeInfo,
                });
            }
        } else {
            response.render("changePassword", {
                error: "رمزعبور جدید را درست تکرار کنید.",
                isPasswordChange: 0,
                token: token,
                storeInfo: storeInfo,
            });
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/changePassword",
        });
    }
}

module.exports = router;
