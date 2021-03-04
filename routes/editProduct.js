const express = require("express");
const router = express.Router();
const multer = require("multer");
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const mongoose = require("mongoose");
const MongoClient = require("mongodb").MongoClient;
const { Categories } = require("../models/categories");
const url = serverConfig.mongoDB;
let ObjectId = require("mongodb").ObjectID;
const persianJs = require("persianjs");
const momentJalaali = require("moment-jalaali");
momentJalaali.loadPersian({ usePersianDigits: true });
let jalaliDate = momentJalaali(new Date()).format("jYYYY/jMM/jDD");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "static/uploads/products/images/");
    },
    filename: (req, file, cb) => {
        // console.log(req.body.collectionName);
        cb(null, file.originalname);
        // cb(null, req.body.collectionName + req.body.productType + jalaliDate);
    },
});
const upload = multer({ storage: storage });

router.get("/", editProduct);
router.post("/", upload.single("productPicture"), editProductAPI);

async function editProduct(req, res, next) {
    try {
        const token = req.query.userToken || req.query.userTokenHide;
        let { productId } = req.query;
        let collectionName = req.user.userStore.storeId;
        let dbName = "ecommerce";
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let resultProducts = await ecommerce
            .collection(collectionName)
            .find({ _id: ObjectId(productId) })
            .toArray();
        let resultCategories = await ecommerce
            .collection("categories")
            .find()
            .toArray();
        res.render("editProduct", {
            product: resultProducts[0],
            storeInfo: req.user.userStore,
            resultCategories: resultCategories,
            productEdited: 0,
            token: token,
        });
        next();
    } catch (error) {
        console.log(error);
    }
}

async function editProductAPI(req, res, next) {
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
        } = req.body;
        let category = await Categories.findOne({ categoryName: categoryName });
        let productType = category.categoryNameForRequest;
        let collectionName = req.user.userStore.storeId;
        const token = req.query.userToken || req.query.userTokenHide;
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
            if (req.file != undefined) {
                productPicture = req.file.path.replace(/\\/g, "/").substr(7);
                query = {
                    productName: persianJs(productName)
                        .englishNumber()
                        .toString(),
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
                    storeId: collectionName,
                    inStock: Number(inStock),
                    createdAt: jalaliDate,
                };
            } else {
                query = {
                    productName: persianJs(productName)
                        .englishNumber()
                        .toString(),
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
                    storeId: collectionName,
                    inStock: Number(inStock),
                    createdAt: jalaliDate,
                };
            }
            updateFunction(collectionName, query);

            let dbName = "ecommerce";
            const client = await MongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            let ecommerce = client.db(dbName);
            let resultProducts = await ecommerce
                .collection(collectionName)
                .find({ _id: ObjectId(productId) })
                .toArray();
            let resultCategories = await ecommerce
                .collection("categories")
                .find()
                .toArray();
            res.render("editProduct", {
                product: resultProducts[0],
                storeInfo: req.user.userStore,
                resultCategories: resultCategories,
                productEdited: 1,
                token: token,
            });
        }
        next();
    } catch (error) {
        res.json({
            status: 400,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/editProduct",
        });
    }
}

module.exports = router;
