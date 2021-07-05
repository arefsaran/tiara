const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { User } = require("../../models/user");
let ObjectId = require("mongodb").ObjectID;
const persianJs = require("persianjs");
const { JWT_PRIVATE_KEY } = require("../../config/config");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads/storesLogo/images/");
    },
    filename: (req, file, cb) => {
        // console.log(req.body.collectionName);
        cb(null, file.originalname);
        // cb(null, req.body.collectionName + req.body.categoryName + jalaliDate);
    },
});
const upload = multer({ storage: storage });

router.get("/", settingsFunction);
router.post("/", upload.single("storePicture"), settingsAPI);

async function settingsFunction(req, res, next) {
    try {
        let userToken = req.query.userToken;
        res.render("settings", {
            storeInfo: req.user.userStore,
            storeDetails: req.user,
            token: userToken,
            edit: 0,
        });
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

async function settingsAPI(req, res, next) {
    try {
        let {
            userName,
            userEmail,
            storeName,
            storeId,
            storeAddress,
            storePhoneNumber,
        } = req.body;
        let planType = req.user.userStore.storePlan.planType;
        let planTimeToExpiry = req.user.userStore.storePlan.planTimeToExpiry;
        let collectionName = "users";
        let collection = req.user.userStore.storeId;
        let userId = req.user._id;
        const token = req.query.userToken || req.query.userTokenHide;
        async function updateFunction(name, query) {
            // await mongoose.connection.db
            //     .collection(`${collection}`)
            //     .rename(`${storeId}`);
            mongoose.connection.db.collection(name, function (err, collection) {
                collection.updateOne(
                    { _id: ObjectId(userId) },
                    { $set: query }
                );
            });
        }
        if (collectionName) {
            let storePicture = "";
            let query = {};
            if (req.file != undefined) {
                storePicture = req.file.path.replace(/\\/g, "/").substr(7);
                query = {
                    userName: persianJs(userName.toLowerCase())
                        .englishNumber()
                        .toString(),
                    userEmail: persianJs(userEmail.toLowerCase())
                        .toEnglishNumber()
                        .toString(),
                    userStore: {
                        storePlan: {
                            planType: Number(planType),
                            planTimeToExpiry: Number(planTimeToExpiry),
                        },
                        storePicture: storePicture,
                        storeName: persianJs(storeName.toLowerCase())
                            .englishNumber()
                            .toString(),
                        storeId: persianJs(storeId)
                            .toEnglishNumber()
                            .toString(),
                        storeAddress:
                            persianJs(storeAddress)
                                .englishNumber()
                                .toString() || "",
                        storePhoneNumber:
                            persianJs(storePhoneNumber)
                                .toEnglishNumber()
                                .toString() || "",
                    },
                    updateTime: jalaliDate,
                };
            } else {
                query = {
                    userName: persianJs(userName.toLowerCase())
                        .englishNumber()
                        .toString(),
                    userEmail: persianJs(userEmail.toLowerCase())
                        .toEnglishNumber()
                        .toString(),
                    userStore: {
                        storePicture: req.user.userStore.storePicture,
                        storePlan: {
                            planType: Number(planType),
                            planTimeToExpiry: Number(planTimeToExpiry),
                        },
                        storeName: persianJs(storeName.toLowerCase())
                            .englishNumber()
                            .toString(),
                        storeId: persianJs(storeId)
                            .toEnglishNumber()
                            .toString(),
                        storeAddress: persianJs(storeAddress)
                            .englishNumber()
                            .toString(),
                        storePhoneNumber: persianJs(storePhoneNumber)
                            .toEnglishNumber()
                            .toString(),
                    },
                    updateTime: jalaliDate,
                };
            }
            updateFunction(collectionName, query);
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            let userInfo = await User.findOne({
                _id: decoded._id,
            });
            res.render("settings", {
                storeInfo: req.user.userStore,
                storeDetails: userInfo,
                token: token,
                edit: 1,
            });
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/settings",
        });
    }
}

module.exports = router;
