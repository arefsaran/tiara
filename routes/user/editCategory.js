const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");
let ObjectId = require("mongodb").ObjectID;
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, "static/uploads/categories/images/");
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

router.get("/", editCategory);
router.post("/", upload.single("categoryPicture"), editCategoryAPI);

async function editCategory(request, response, next) {
    try {
        const token = request.query.userToken || request.query.userTokenHide;
        let { categoryId } = request.query;
        let collectionName = "categories";
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let resultCategory = await databaseClient
            .collection(collectionName)
            .find({ _id: ObjectId(categoryId) })
            .toArray();
        response.render("editCategory", {
            categories: resultCategory[0],
            storeInfo: request.user.userStore,
            categoryEdited: 0,
            token: token,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/editCategory",
        });
    }
}

async function editCategoryAPI(request, response, next) {
    try {
        let { categoryId, categoryName, newCategoryName } = request.body;
        let storeId = request.user.userStore.storeId;
        let collectionName = "categories";
        const token = request.query.userToken || request.query.userTokenHide;
        function update(query) {
            mongoose.connection.db.collection(collectionName, function (
                err,
                collection
            ) {
                collection.updateOne(
                    { _id: ObjectId(categoryId) },
                    { $set: query }
                );
                mongoose.connection.db.collection(storeId, function (
                    err,
                    collection
                ) {
                    collection.updateMany(
                        { categoryName: categoryName },
                        { $set: { categoryName: newCategoryName } }
                    );
                });
            });
        }
        if (storeId) {
            let categoryPicture = "";
            let query = {};
            if (request.file != undefined) {
                categoryPicture = request.file.path
                    .replace(/\\/g, "/")
                    .substr(7);
                query = {
                    categoryName: persianJs(newCategoryName)
                        .englishNumber()
                        .toString(),
                    categoryPicture: categoryPicture,
                    storeId: storeId,
                    editedAt: jalaliDate,
                };
            } else {
                query = {
                    categoryName: persianJs(newCategoryName)
                        .englishNumber()
                        .toString(),
                    storeId: storeId,
                    editedAt: jalaliDate,
                };
            }
            update(query);
            const client = await MongoClient.connect(DATABASE_ADDRESS, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let databaseClient = client.db(DATABASE_NAME);
            let resultCategory = await databaseClient
                .collection(collectionName)
                .find({ _id: ObjectId(categoryId) })
                .toArray();
            response.render("editCategory", {
                categories: resultCategory[0],
                storeInfo: request.user.userStore,
                categoryEdited: 1,
                token: token,
            });
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/editCategory",
        });
    }
}

module.exports = router;
