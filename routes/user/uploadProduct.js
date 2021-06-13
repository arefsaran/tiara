const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { Categories } = require("../../models/categories");
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;
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

router.get("/", uploadProductView);
router.post("/", upload.single("productPicture"), uploadProductFunction);

async function uploadProductView(req, res) {
    try {
        let storeId = "categories";
        let dbName = "ecommerce";
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultCategories = await ecommerce
            .collection(storeId)
            .find()
            .toArray();
        res.render("uploadProduct", {
            storeInfo: req.user.userStore,
            resultCategories: resultCategories,
            productUploaded: "0",
        });
    } catch (error) {
        res.json({
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
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
        let category = await Categories.findOne({ categoryName: categoryName });
        let productType = category.categoryNameForRequest;
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
                productType: productType,
                productTypeInPersian: categoryName,
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
            const client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(dbName);
            let resultCategories = await ecommerce
                .collection("categories")
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
            status: 400,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/uploadProducts",
        });
    }
}

module.exports = router;
