const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { MONGO_DB } = require("../../config/config");
let ObjectId = require("mongodb").ObjectID;
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads/categories/images/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
        // cb(null, req.body.storeId + req.body.categoryName + jalaliDate);
    },
});
const upload = multer({ storage: storage });

router.get("/", editCategory);
router.post("/", upload.single("categoryPicture"), editCategoryAPI);

async function editCategory(req, res, next) {
    try {
        const token = req.query.userToken || req.query.userTokenHide;
        let { categoryId } = req.query;
        let collectionName = "category";
        let storeId = req.user.userStore.storeId;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategory = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(categoryId) })
            .toArray();
        res.render("editCategory", {
            category: resultCategory[0],
            storeInfo: req.user.userStore,
            categoryEdited: 0,
            token: token,
        });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/editCategory",
        });
    }
}

async function editCategoryAPI(req, res, next) {
    try {
        let { categoryId, categoryName, newCategoryName } = req.body;
        let storeId = req.user.userStore.storeId;
        let collectionName = "category";
        const token = req.query.userToken || req.query.userTokenHide;
        function updateFunction(query) {
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
            if (req.file != undefined) {
                categoryPicture = req.file.path.replace(/\\/g, "/").substr(7);
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
            updateFunction(query);

            let dbName = "ecommerce";
            const client = await MongoClient.connect(MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(dbName);
            let resultCategory = await ecommerce
                .collection(collectionName)
                .find({ _id: ObjectId(categoryId) })
                .toArray();
            res.render("editCategory", {
                category: resultCategory[0],
                storeInfo: req.user.userStore,
                categoryEdited: 1,
                token: token,
            });
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/editCategory",
        });
    }
}

module.exports = router;
