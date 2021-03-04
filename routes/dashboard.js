const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;
const ObjectId = require("mongoose").Types.ObjectId;
const { Purchase } = require("../models/purchase");

router.get("/", dashboardView);

async function dashboardView(req, res, next) {
    try {
        let userToken = req.query.userToken;
        let storeId = req.user.userStore.storeId;
        let collectionName = "purchases";
        let dbName = "ecommerce";
        let nowISO = new Date();
        let lastMonthSalesTotalPrice = 0;
        let totalPrice = 0;
        let lastMonthISO = new Date(
            nowISO.getFullYear(),
            nowISO.getMonth() - 1,
            nowISO.getDate()
        );
        let lastMonthSalesQuery = {
            createdAt: { $lt: nowISO, $gt: lastMonthISO },
            storeId: storeId,
        };

        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);

        let lastMonthSales = await ecommerce
            .collection(collectionName)
            .find(lastMonthSalesQuery, { totalPrice: 1 })
            .toArray();
        lastMonthSales.forEach((sale) => {
            lastMonthSalesTotalPrice =
                lastMonthSalesTotalPrice + sale.totalPrice;
        });

        let totalSales = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId }, { totalPrice: 1 })
            .toArray();
        totalSales.forEach((sale) => {
            totalPrice = totalPrice + sale.totalPrice;
        });
        client.close();

        let numberOfPurchases = await Purchase.find({
            storeId: storeId,
        }).countDocuments();

        let purchases = await Purchase.find({ storeId: storeId })
            .sort({ _id: -1 })
            .limit(5);

        res.render("dashboard", {
            numberOfPurchases: numberOfPurchases,
            storeInfo: req.user.userStore,
            purchases: purchases,
            lastMonthSalesTotalPrice: lastMonthSalesTotalPrice,
            totalPriceOfPurchases: totalPrice,
            userToken: userToken,
        });
        next();
    } catch (error) {
        res.json({ error: error });
    }
}

module.exports = router;
