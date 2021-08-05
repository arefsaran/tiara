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

router.get("/", editProduct);
router.post("/", upload.single("productPicture"), editProductAPI);

async function editProduct(request, response, next) {
    try {
        const token = request.query.userToken || request.query.userTokenHide;
        let { productId } = request.query;
        let collectionName = request.user.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        let resultCategories = await ecommerce
            .collection("categories")
            .find()
            .toArray();
        response.render("editProduct", {
            product: resultProducts[0],
            storeInfo: request.user.userStore,
            resultCategories: resultCategories,
            productEdited: 0,
            token: token,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/editProduct",
        });
    }
}

async function editProductAPI(request, response, next) {
    try {
        let {
            productId,
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
        let collectionName = request.user.userStore.storeId;
        const token = request.query.userToken || request.query.userTokenHide;
        function updateFunction(name, query) {
            mongoose.connection.db.collection(name, function (err, collection) {
                collection.updateOne(
                    { _id: ObjectId(productId) },
                    { $set: query }
                );
            });
        }
        if (collectionName) {
            let productPicture = "";
            let query = {};
            if (request.file != undefined) {
                productPicture = request.file.path
                    .replace(/\\/g, "/")
                    .substr(7);
                query = {
                    productName: persianJs(productName)
                        .englishNumber()
                        .toString(),
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
                    storeId: collectionName,
                    inStock: Number(inStock),
                    createdAt: jalaliDate,
                };
            } else {
                query = {
                    productName: persianJs(productName)
                        .englishNumber()
                        .toString(),
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
                    storeId: collectionName,
                    inStock: Number(inStock),
                    createdAt: jalaliDate,
                };
            }
            updateFunction(collectionName, query);
            const client = await MongoClient.connect(DATABASE_ADDRESS, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(DATABASE_NAME);
            let resultProducts = await ecommerce
                .collection(collectionName)
                .find({ _id: ObjectId(productId) })
                .toArray();
            let resultCategories = await ecommerce
                .collection("categories")
                .find()
                .toArray();
            response.render("editProduct", {
                product: resultProducts[0],
                storeInfo: request.user.userStore,
                resultCategories: resultCategories,
                productEdited: 1,
                token: token,
            });
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/user/editProduct",
        });
    }
}

module.exports = router;
