const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, "static/uploads/products/images/");
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

router.get("/", uploadCategoryView);
router.post("/", upload.single("categoryPicture"), uploadCategoryFunction);

async function uploadCategoryView(request, response, next) {
    try {
        response.render("uploadCategory", {
            storeInfo: request.user.userStore,
            categoryUploaded: "0",
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/uploadCategory",
        });
    }
}

async function uploadCategoryFunction(request, response, next) {
    try {
        let { categoryName } = request.body;
        let storeId = request.user.userStore.storeId;
        let collectionName = "categories";
        function insertFunction(collectionName, query) {
            mongoose.connection.db.collection(collectionName, async function (
                err,
                collection
            ) {
                await collection.insertOne(query);
            });
        }
        if (storeId) {
            let categoryInStore = await Category.findOne({
                categoryName: categoryName,
                storeId: storeId,
            });
            if (!categoryInStore) {
                let categoryPicture = request.file.path
                    .replace(/\\/g, "/")
                    .substr(7);
                let query = {
                    categoryName: persianJs(categoryName)
                        .englishNumber()
                        .toString(),
                    categoryPicture: categoryPicture,
                    storeId: storeId,
                    createdAt: jalaliDate,
                };
                insertFunction(collectionName, query);
                response.render("uploadCategory", {
                    storeInfo: request.user.userStore,
                    categoryUploaded: "1",
                });
            } else {
                response.render("uploadCategory", {
                    storeInfo: request.user.userStore,
                    categoryUploaded: "2",
                });
            }
        }
        return;
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/uploadCategory",
        });
    }
}

module.exports = router;
