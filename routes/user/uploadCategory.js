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
    destination: (req, file, cb) => {
        cb(null, "static/uploads/products/images/");
    },
    filename: (req, file, cb) => {
        // console.log(req.body.storeId);
        cb(null, file.originalname);
        // cb(null, req.body.storeId + req.body.productType + jalaliDate);
    },
});
const upload = multer({ storage: storage });

router.get("/", uploadCategoryView);
router.post("/", upload.single("categoryPicture"), uploadCategoryFunction);

async function uploadCategoryView(req, res) {
    try {
        res.render("uploadCategory", {
            storeInfo: req.user.userStore,
            categoryUploaded: "0",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/uploadCategory",
        });
    }
}

async function uploadCategoryFunction(req, res) {
    try {
        let { categoryName } = req.body;
        let storeId = req.user.userStore.storeId;
        let collectionName = "category";
        function insertFunction(collectionName, query) {
            mongoose.connection.db.collection(collectionName, async function (
                err,
                collection
            ) {
                await collection.insertOne(query);
            });
        }
        if (storeId) {
            let categoryPicture = req.file.path.replace(/\\/g, "/").substr(7);
            let query = {
                categoryName: persianJs(categoryName)
                    .englishNumber()
                    .toString(),
                categoryPicture: categoryPicture,
                storeId: storeId,
            };
            insertFunction(collectionName, query);
            let dbName = "ecommerce";
            const client = await MongoClient.connect(MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(dbName);
            let resultCategories = await ecommerce
                .collection("category")
                .find({ storeId: storeId })
                .toArray();

            res.render("uploadCategory", {
                storeInfo: req.user.userStore,
                categoryUploaded: "1",
            });
        }
        return;
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/uploadCategory",
        });
    }
}

module.exports = router;
