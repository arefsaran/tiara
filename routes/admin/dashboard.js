const { User } = require("../../models/user");
const MongoClient = require("mongodb").MongoClient;
const { DATABASE_ADDRESS, DATABASE_NAME } = require("../../config/config");

async function adminDashboard(request, response, next) {
    try {
        let adminToken = request.query.adminToken;
        let collectionName = "users";
        let nowISO = new Date();
        let lastMonthSalesAmount = 0;
        let salesAmount = 0;
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
        let databaseClient = client.db(DATABASE_NAME);
        let lastMonthSales = await databaseClient
            .collection(collectionName)
            .find(lastMonthSalesQuery)
            .toArray();
        lastMonthSales.forEach((sale) => {
            lastMonthSalesAmount = lastMonthSalesAmount + sale.userPaid;
        });
        let sales = await databaseClient
            .collection(collectionName)
            .find({})
            .toArray();
        sales.forEach((sale) => {
            salesAmount = salesAmount + sale.userPaid;
        });
        client.close();
        let usersNumber = await User.find({}).countDocuments();
        let users = await User.find({}).sort({ _id: -1 }).limit(5);
        response.render("adminDashboard", {
            usersNumber: usersNumber,
            users: users,
            adminInfo: request.admin.firstName,
            lastMonthSalesAmount: lastMonthSalesAmount,
            lastMonthSalesNumber: lastMonthSales.length,
            salesAmount: salesAmount,
            adminToken: adminToken,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/admin/dashboard",
        });
    }
}

exports.adminDashboard = adminDashboard;
