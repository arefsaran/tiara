const { User } = require("../../models/user");
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;

async function adminDashboardView(req, res, next) {
    try {
        let adminToken = req.query.adminToken;
        let collectionName = "users";
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
        };
        const client = await MongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(dbName);
        let lastMonthSales = await ecommerce
            .collection(collectionName)
            .find(lastMonthSalesQuery)
            .toArray();
        lastMonthSales.forEach((sale) => {
            lastMonthSalesTotalPrice = lastMonthSalesTotalPrice + sale.userPaid;
        });
        let totalSales = await ecommerce
            .collection(collectionName)
            .find({})
            .toArray();
        totalSales.forEach((sale) => {
            totalPrice = totalPrice + sale.userPaid;
        });
        client.close();
        let numberOfUsers = await User.find({}).countDocuments();
        let users = await User.find({}).sort({ _id: -1 }).limit(5);
        res.render("adminDashboard", {
            numberOfUsers: numberOfUsers,
            users: users,
            adminInfo: req.admin.firstName,
            lastMonthSalesTotalPrice: lastMonthSalesTotalPrice,
            lastMonthSalesCount: lastMonthSales.length,
            totalPriceOfUsers: totalPrice,
            adminToken: adminToken,
        });
        next();
    } catch (error) {
        res.json({
            status: 400,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/admin/dashboard",
        });
    }
}

exports.adminDashboardView = adminDashboardView;
