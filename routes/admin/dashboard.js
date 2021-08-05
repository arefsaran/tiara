const { User } = require("../../models/user");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

async function adminDashboardView(request, response, next) {
    try {
        let adminToken = request.query.adminToken;
        let collectionName = "users";
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
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
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
        response.render("adminDashboard", {
            numberOfUsers: numberOfUsers,
            users: users,
            adminInfo: request.admin.firstName,
            lastMonthSalesTotalPrice: lastMonthSalesTotalPrice,
            lastMonthSalesCount: lastMonthSales.length,
            totalPriceOfUsers: totalPrice,
            adminToken: adminToken,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/admin/dashboard",
        });
    }
}

exports.adminDashboardView = adminDashboardView;
