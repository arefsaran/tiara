const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, validate } = require("../../models/user");
const { BlockedSubDomain } = require("../../models/blockedSubDomain");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS } = require("../../config/config");
const momentJalaali = require("moment-jalaali");

router.get("/", signupView);
router.post("/", signupFunction);

async function signupView(request, response, next) {
    try {
        response.render("signup", { error: "" });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/signup",
        });
    }
}

async function signupFunction(request, response, next) {
    try {
        const { error } = validate(request.body);
        let nowISO = new Date();
        Date.prototype.addHours = function (h) {
            this.setTime(this.getTime() + h * 60 * 60 * 1000);
            return this;
        };
        // let iranTime = nowISO.addHours(3.5);
        let iranTime = nowISO.addHours(0);
        momentJalaali.loadPersian({ usePersianDigits: true });
        let paidTime = momentJalaali(iranTime).format("jYYYY/jMM/jDD HH:mm");
        let {
            userName,
            userEmail,
            userPassword,
            userStoreName,
            userStoreNameInEnglish,
        } = request.body;
        if (error) {
            response.render("signup", {
                error: `${error}`,
            });
            // response.json({ error: `${error}` });
        } else {
            let userWithThisEmail = await User.findOne({
                userEmail: userEmail.toLowerCase(),
            });
            let subDomainWithThisStoreName = await User.findOne({
                "userStore.storeId": userStoreNameInEnglish.toLowerCase(),
            });
            let blockedUserStoreName = await BlockedSubDomain.findOne({
                subDomain: userStoreName.toLowerCase(),
            });
            let blockedSubDomain = await BlockedSubDomain.findOne({
                subDomain: userStoreNameInEnglish.toLowerCase(),
            });
            if (userWithThisEmail) {
                // response.json({ error: "با این ایمیل قبلا ثبت نام شده است" });
                return response.render("signup", {
                    error: "با این ایمیل قبلا ثبت نام شده است",
                });
            } else if (subDomainWithThisStoreName) {
                return response.render("signup", {
                    error: "با این آدرس قبلا ثبت نام شده است",
                });
            } else if (blockedUserStoreName || blockedSubDomain) {
                return response.render("signup", {
                    error:
                        "نام فروشگاه یا آدرس اینترنتی فروشگاه شما نامناسب تشخیص داده شد، . در صورت مناسب بودن نام یا آدرس پیشنهادی به پشتیبانی پیام دهید. ",
                });
            } else {
                let user = new User({
                    userName: userName.toLowerCase(),
                    userEmail: userEmail.toLowerCase(),
                    userPassword: userPassword,
                    "userStore.storeName": userStoreName,
                    "userStore.storeId": userStoreNameInEnglish
                        .toLowerCase()
                        .replace(/\s+/g, "")
                        .toLowerCase(),
                    "userStore.storePlan.planType": 1,
                    "userStore.paidTime": paidTime,

                    // userPicture : request.files[0].path.replace(/\\/g, "/")
                });
                MongoClient.connect(
                    DATABASE_ADDRESS,
                    { useUnifiedTopology: true },
                    function (err, db) {
                        if (err) throw err;
                        let dbo = db.db(DATABASE_NAME);
                        dbo.createCollection(
                            userStoreNameInEnglish.toLowerCase(),
                            function (err, response) {
                                if (err) throw err;
                                db.close();
                            }
                        );
                    }
                );
                const salt = await bcrypt.genSalt(10);
                user.userPassword = await bcrypt.hash(user.userPassword, salt);
                await user.save();
                const token = user.generateAuthToken();
                // response.render("dashboard", {
                //     userToken: token,
                // });
                return response.redirect(`/user/dashboard?userToken=${token}`);
            }
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/signup",
        });
    }
}

module.exports = router;
