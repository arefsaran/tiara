const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { Category } = require("../../models/category");
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
        cb(null, file.originalname);
        // cb(null, req.body.storeId + req.body.categoryName + jalaliDate);
    },
});
const upload = multer({ storage: storage });

router.get("/", uploadProductView);
router.post("/", upload.single("productPicture"), uploadProductFunction);

async function uploadProductView(req, res) {
    try {
        let storeId = req.user.userStore.storeId;
        let collectionName = "category";
        let dbName = "ecommerce";
        const client = await MongoClient.connect(MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        res.render("uploadProduct", {
            storeInfo: req.user.userStore,
            resultCategories: resultCategories,
            productUploaded: "0",
        });
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/uploadProduct",
        });
    }
}

async function uploadProductFunction(req, res) {
    try {
        let {
            productName,
            productManufacturingDate,
            productExpirationDate,
            productSize,
            productPrice,
            subType,
            categoryName,
            inStock,
            userTokenHide,
        } = req.body;
        let storeId = req.user.userStore.storeId;
        function insertFunction(name, query) {
            mongoose.connection.db.collection(name, function (err, collection) {
                collection.insertOne(query);
            });
        }
        if (storeId) {
            let productPicture = req.file.path.replace(/\\/g, "/").substr(7);
            let query = {
                productName: persianJs(productName).englishNumber().toString(),
                productPicture: productPicture,
                categoryName: categoryName,
                productDetails: {
                    productPrice: persianJs(productPrice)
                        .englishNumber()
                        .toString(),
                    productManufacturingDate: persianJs(
                        productManufacturingDate
                    )
                        .englishNumber()
                        .toString(),
                    productExpirationDate: persianJs(productExpirationDate)
                        .englishNumber()
                        .toString(),
                    productSize: persianJs(productSize)
                        .englishNumber()
                        .toString(),
                    productPriceEnglishNumber: Number(productPrice),
                    subType: subType || "other",
                },
                storeId: storeId,
                inStock: Number(inStock),
                createdAt: jalaliDate,
            };
            insertFunction(storeId, query);
            let dbName = "ecommerce";
            const client = await MongoClient.connect(MONGO_DB, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(dbName);
            let resultCategories = await ecommerce
                .collection("category")
                .find()
                .toArray();

            res.render("uploadProduct", {
                storeInfo: req.user.userStore,
                resultCategories: resultCategories,
                productUploaded: "1",
            });
        }
        return;
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/uploadProduct",
        });
    }
}

module.exports = router;
