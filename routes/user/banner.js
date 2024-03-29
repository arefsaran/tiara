const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
let ObjectId = require("mongodb").ObjectID;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
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
                Math.random() * 900000 +
                "_" +
                file.originalname
        );
    },
});
const upload = multer({ storage: storage });

router.get("/", uploadBannerView);
router.post("/", upload.array("bannerPictures"), uploadBanner);
router.get("/delete", deleteBanner);

async function uploadBannerView(request, response, next) {
    try {
        let storeId = request.user.userStore.storeId;
        let token = request.query.userToken;
        let collectionName = "banners";
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let resultBanners = await databaseClient
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let bannerUploaded = 0;
        if (resultBanners.length == 0) {
            bannerUploaded = "2";
        }
        response.render("banners", {
            storeInfo: request.user.userStore,
            resultBanners: resultBanners,
            bannerUploaded: bannerUploaded,
            token: token,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/banner",
        });
    }
}

async function uploadBanner(request, response, next) {
    try {
        let pictures = request.files;
        let token = request.query.userToken;
        let collectionName = "banners";
        let storeId = request.user.userStore.storeId;
        function insert(collectionName, query) {
            mongoose.connection.db.collection(collectionName, function (
                err,
                collection
            ) {
                collection.insertOne(query);
            });
        }
        if (storeId && pictures) {
            pictures.forEach((picture) => {
                let query = {
                    picture: picture.path.replace(/\\/g, "/").substr(7),
                    storeId: storeId,
                };
                insert(collectionName, query);
            });
            const client = await MongoClient.connect(DATABASE_ADDRESS, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let databaseClient = client.db(DATABASE_NAME);
            let resultBanners = await databaseClient
                .collection("banners")
                .find()
                .toArray();
            response.render("banners", {
                storeInfo: request.user.userStore,
                resultBanners: resultBanners,
                bannerUploaded: "1",
                token: token,
            });
        } else if (!bannerName && storeId) {
            response.render("banners", {
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
            path: "POST:/user/banner",
        });
    }
}

async function deleteBanner(request, response, next) {
    try {
        let collectionName = "banners";
        let storeId = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        const { deleteBannerId } = request.query;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        mongoose.connection.db.collection(collectionName, (err, collection) => {
            collection.deleteOne({ _id: ObjectId(deleteBannerId) });
        });
        let resultBanners = await databaseClient
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        response.render("banners", {
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
            path: "DELETE:/user/deleteBanner",
        });
    }
}

module.exports = router;
