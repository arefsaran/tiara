const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, validate } = require("../../models/user");
const { BlockSubDomain } = require("../../models/blockSubDomain");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
const momentJalaali = require("moment-jalaali");

router.get("/", signUpView);
router.post("/", signUpFunction);

async function signUpView(req, res, next) {
    try {
        res.render("signUp", { error: "" });
        next();
    } catch (error) {
        res.json({ error });
    }
}

async function signUpFunction(req, res, next) {
    try {
        const { error } = validate(req.body);
        let nowISO = new Date();
        Date.prototype.addHours = function (h) {
            this.setTime(this.getTime() + h * 60 * 60 * 1000);
            return this;
        };
        let iranTime = nowISO.addHours(3.5);
        momentJalaali.loadPersian({ usePersianDigits: true });
        let paidTime = momentJalaali(iranTime).format("jYYYY/jMM/jDD HH:mm");
        let {
            userName,
            userEmail,
            userPassword,
            userStoreName,
            userStoreNameInEnglish,
        } = req.body;
        if (error) {
            res.render("signUp", {
                error: `${error}`,
            });
            // res.json({ error: `${error}` });
        } else {
            let userWithThisEmail = await User.findOne({
                userEmail: userEmail.toLowerCase(),
            });
            let subDomainWithThisStoreName = await User.findOne({
                "userStore.storeId": userStoreNameInEnglish.toLowerCase(),
            });
            let blockedUserStoreName = await BlockSubDomain.findOne({
                subDomain: userStoreName.toLowerCase(),
            });
            let blockedSubDomain = await BlockSubDomain.findOne({
                subDomain: userStoreNameInEnglish.toLowerCase(),
            });
            if (userWithThisEmail) {
                // res.json({ error: "با این ایمیل قبلا ثبت نام شده است" });
                return res.render("signUp", {
                    error: "با این ایمیل قبلا ثبت نام شده است",
                });
            } else if (subDomainWithThisStoreName) {
                return res.render("signUp", {
                    error: "با این آدرس قبلا ثبت نام شده است",
                });
            } else if (blockedUserStoreName || blockedSubDomain) {
                return res.render("signUp", {
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

                    // userPicture : req.files[0].path.replace(/\\/g, "/")
                });
                MongoClient.connect(
                    MONGO_DB,
                    { useUnifiedTopology: true },
                    function (err, db) {
                        if (err) throw err;
                        let dbo = db.db("ecommerce");
                        dbo.createCollection(
                            userStoreNameInEnglish.toLowerCase(),
                            function (err, res) {
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
                // res.render("dashboard", {
                //     userToken: token,
                // });
                return res.redirect(`/user/dashboard?userToken=${token}`);
            }
        }
        next();
    } catch (error) {
        // res.render("signUp", {
        //     error: `${error}`,
        // });
        res.json({ errorCatch: `${error}` });
    }
}

module.exports = router;
