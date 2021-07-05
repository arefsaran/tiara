const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads/products/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
        // cb(null, req.body.storeId + req.body.categoryName + jalaliDate);
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
        console.log("categoryNameوstoreId", categoryName, storeId);
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
                createdAt: jalaliDate,
            };
            insertFunction(collectionName, query);
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
