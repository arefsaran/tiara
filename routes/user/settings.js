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
    destination: (request, file, cb) => {
        cb(null, "static/uploads/storesLogo/images/");
    },
    filename: (request, file, cb) => {
        cb(null, file.originalname);
        // cb(null, request.body.collectionName + request.body.categoryName + jalaliDate);
    },
});
const upload = multer({ storage: storage });

router.get("/", settings);
router.post("/", upload.single("storePicture"), settingsAPI);

async function settings(request, response, next) {
    try {
        let userToken = request.query.userToken;
        response.render("settings", {
            storeInfo: request.user.userStore,
            storeDetails: request.user,
            token: userToken,
            edit: 0,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/settings",
        });
    }
}

async function settingsAPI(request, response, next) {
    try {
        let {
            userName,
            storeName,
            storeAddress,
            storePhoneNumber,
            shippingCost,
            MERCHANT_ID,
            raychat,
            domain,
        } = request.body;
        let userEmail = request.user.userEmail;
        let storeId = request.user.userStore.storeId;
        let planType = request.user.userStore.storePlan.planType;
        let planTimeToExpiry =
            request.user.userStore.storePlan.planTimeToExpiry;
        let collectionName = "users";
        let userId = request.user._id;
        domain = domain.toLowerCase();
        const token = request.query.userToken || request.query.userTokenHide;
        if (domain.length > 0) {
            domain = persianJs(domain).toEnglishNumber().toString();
        }
        if (domain.startsWith("www.")) {
            domain = domain.replace("www.", "");
        }
        async function update(name, query) {
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
        let storePicture = "";
        let query = {};
        if (request.file != undefined) {
            storePicture = request.file.path.replace(/\\/g, "/").substr(7);
            query = {
                userName: persianJs(userName.toLowerCase())
                    .englishNumber()
                    .toString(),
                userEmail: persianJs(userEmail.toLowerCase())
                    .toEnglishNumber()
                    .toString(),
                MERCHANT_ID: MERCHANT_ID,
                userStore: {
                    storePlan: {
                        planType: Number(planType),
                        planTimeToExpiry: Number(planTimeToExpiry),
                    },
                    storePicture: storePicture,
                    storeName: persianJs(storeName.toLowerCase())
                        .englishNumber()
                        .toString(),
                    domain: domain,
                    storeId: persianJs(storeId).toEnglishNumber().toString(),
                    shippingCost: parseInt(
                        persianJs(shippingCost).toEnglishNumber()
                    ),
                    storeAddress:
                        persianJs(storeAddress).englishNumber().toString() ||
                        "",
                    storePhoneNumber:
                        persianJs(storePhoneNumber)
                            .toEnglishNumber()
                            .toString() || "",
                    raychat: raychat,
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
                MERCHANT_ID: MERCHANT_ID,
                userStore: {
                    storePicture: request.user.userStore.storePicture,
                    storePlan: {
                        planType: Number(planType),
                        planTimeToExpiry: Number(planTimeToExpiry),
                    },
                    shippingCost: parseInt(
                        persianJs(shippingCost).toEnglishNumber()
                    ),
                    storeName: persianJs(storeName.toLowerCase())
                        .englishNumber()
                        .toString(),
                    domain: domain,
                    storeId: persianJs(storeId).toEnglishNumber().toString(),
                    storeAddress: persianJs(storeAddress)
                        .englishNumber()
                        .toString(),
                    storePhoneNumber: persianJs(storePhoneNumber)
                        .toEnglishNumber()
                        .toString(),
                    raychat: raychat,
                },
                updateTime: jalaliDate,
            };
        }
        update(collectionName, query);
        request.user = await User.findOne({
            _id: request.user._id,
        });
        response.render("settings", {
            storeInfo: request.user.userStore,
            storeDetails: request.user,
            token: token,
            edit: 1,
        });

        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/settings",
        });
    }
}

module.exports = router;
