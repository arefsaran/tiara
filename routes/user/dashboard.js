const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { Purchase } = require("../../models/purchase");
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

router.get("/", dashboardView);

async function dashboardView(request, response, next) {
    try {
        let userToken = request.query.userToken;
        let storeId = request.user.userStore.storeId;
        let collectionName = "purchases";
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
            done: 1,
        };

        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);

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
            .find({ storeId: storeId, done: 1 }, { totalPrice: 1 })
            .toArray();
        totalSales.forEach((sale) => {
            totalPrice = totalPrice + sale.totalPrice;
        });
        client.close();

        let numberOfPurchases = await Purchase.find({
            storeId: storeId,
            done: 1,
        }).countDocuments();

        let purchases = await Purchase.find({ storeId: storeId, done: 1 })
            .sort({ _id: -1 })
            .limit(5);

        response.render("dashboard", {
            numberOfPurchases: numberOfPurchases,
            storeInfo: request.user.userStore,
            purchases: purchases,
            lastMonthSalesTotalPrice: lastMonthSalesTotalPrice,
            totalPriceOfPurchases: totalPrice,
            userToken: userToken,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/user/dashboard",
        });
    }
}

module.exports = router;
