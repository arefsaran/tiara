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

router.get("/", uploadProductView);
router.post("/", upload.single("productPicture"), uploadProduct);

async function uploadProductView(request, response, next) {
    try {
        let storeId = request.user.userStore.storeId;
        let collectionName = "categories";
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let isProductUpload = 0;
        if (categories.length == 0) {
            isProductUpload = "2";
        }
        response.render("uploadProduct", {
            storeInfo: request.user.userStore,
            categories: categories,
            isProductUpload: isProductUpload,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/user/uploadProduct",
        });
    }
}

async function uploadProduct(request, response, next) {
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
            productDetail,
        } = request.body;
        let storeId = request.user.userStore.storeId;
        function insert(name, query) {
            mongoose.connection.db.collection(name, function (err, collection) {
                collection.insertOne(query);
            });
        }
        if (storeId && categoryName) {
            let productPicture = request.file.path
                .replace(/\\/g, "/")
                .substr(7);
            let query = {
                productName: persianJs(productName).englishNumber().toString(),
                productPicture: productPicture,
                categoryName: categoryName,
                productDetails: {
                    productDetail: productDetail,
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
            insert(storeId, query);
            const client = await MongoClient.connect(DATABASE_ADDRESS, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let databaseClient = client.db(DATABASE_NAME);
            let categories = await databaseClient
                .collection("categories")
                .find()
                .toArray();
            response.render("uploadProduct", {
                storeInfo: request.user.userStore,
                categories: categories,
                isProductUpload: "1",
            });
        } else if (!categoryName && storeId) {
            response.render("uploadProduct", {
                storeInfo: request.user.userStore,
                categories: [],
                isProductUpload: "2",
            });
        }
        return;
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/user/uploadProduct",
        });
    }
}

module.exports = router;
