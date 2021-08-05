const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    destination: (request, file, cb) => {
        cb(null, "static/uploads/banners/");
    },
    filename: (request, file, cb) => {
        // cb(null, file.originalname);
        cb(
            null,
            request.user.userStore.storeId +
                "_" +
                Math.random() +
                "_" +
                file.originalname
        );
    },
});
const upload = multer({ storage: storage });

router.get("/", uploadBannerView);
router.post("/", upload.array("bannerPictures", 3), uploadBannerFunction);
router.get("/delete", deleteBanner);

async function uploadBannerView(request, response) {
    try {
        let storeId = request.user.userStore.storeId;
        let token = request.query.userToken;
        let collectionName = "banner";
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultBanners = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let bannerUploaded = 0;
        if (resultBanners.length == 0) {
            bannerUploaded = "2";
        }
        response.render("banner", {
            storeInfo: request.user.userStore,
            resultBanners: resultBanners,
            bannerUploaded: bannerUploaded,
            token: token,
        });
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/banner",
        });
    }
}

async function uploadBannerFunction(request, response, next) {
    try {
        let pictures = request.files;
        let token = request.query.userToken;
        let collectionName = "banner";
        let storeId = request.user.userStore.storeId;
        function insertFunction(collectionName, query) {
            mongoose.connection.db.collection(collectionName, function (
                err,
                collection
            ) {
                collection.insertOne(query);
            });
        }
        if (storeId && pictures) {
            pictures.forEach((picture) => {
                let bannerPicture = picture.path.replace(/\\/g, "/").substr(7);
                let query = {
                    bannerPicture: bannerPicture,
                    storeId: storeId,
                };
                insertFunction(collectionName, query);
            });
            const client = await MongoClient.connect(DATABASE_ADDRESS, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(DATABASE_NAME);
            let resultBanners = await ecommerce
                .collection("banner")
                .find()
                .toArray();
            response.render("banner", {
                storeInfo: request.user.userStore,
                resultBanners: resultBanners,
                bannerUploaded: "1",
                token: token,
            });
        } else if (!bannerName && storeId) {
            response.render("banner", {
                storeInfo: request.user.userStore,
                resultBanners: [],
                bannerUploaded: "2",
                token: token,
            });
        }
        return;
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/banner",
        });
    }
}

async function deleteBanner(request, response, next) {
    try {
        let collectionName = "banner";
        let storeId = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        const { deleteBannerId } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteBannerId) });
        });
        let resultBanners = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        response.render("banner", {
            storeInfo: request.user.userStore,
            resultBanners: resultBanners,
            token: token,
            bannerUploaded: "1",
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "DELETE:/user/deleteBanner",
        });
    }
}

module.exports = router;
