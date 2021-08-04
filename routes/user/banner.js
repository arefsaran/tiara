const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    destination: (req, file, cb) => {
        cb(null, "static/uploads/banners/");
    },
    filename: (req, file, cb) => {
        // cb(null, file.originalname);
        cb(
            null,
            req.user.userStore.storeId +
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

async function uploadBannerView(req, res) {
    try {
        let storeId = req.user.userStore.storeId;
        let token = req.query.userToken;
        let collectionName = "banner";
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultBanners = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let bannerUploaded = 0;
        if (resultBanners.length == 0) {
            bannerUploaded = "2";
        }
        res.render("banner", {
            storeInfo: req.user.userStore,
            resultBanners: resultBanners,
            bannerUploaded: bannerUploaded,
            token: token,
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/banner",
        });
    }
}

async function uploadBannerFunction(req, res, next) {
    try {
        let pictures = req.files;
        let token = req.query.userToken;
        let collectionName = "banner";
        let storeId = req.user.userStore.storeId;
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
            let dbName = "ecommerce";
            const client = await MongoClient.connect(MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(dbName);
            let resultBanners = await ecommerce
                .collection("banner")
                .find()
                .toArray();
            res.render("banner", {
                storeInfo: req.user.userStore,
                resultBanners: resultBanners,
                bannerUploaded: "1",
                token: token,
            });
        } else if (!bannerName && storeId) {
            res.render("banner", {
                storeInfo: req.user.userStore,
                resultBanners: [],
                bannerUploaded: "2",
                token: token,
            });
        }
        return;
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/banner",
        });
    }
}

async function deleteBanner(req, res, next) {
    try {
        let collectionName = "banner";
        let storeId = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
        const { deleteBannerId } = req.query;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteBannerId) });
        });
        let resultBanners = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        res.render("banner", {
            storeInfo: req.user.userStore,
            resultBanners: resultBanners,
            token: token,
            bannerUploaded: "1",
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "DELETE:/user/deleteBanner",
        });
    }
}

module.exports = router;
