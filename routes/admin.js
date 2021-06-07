const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { Admin, validateLogin, validate } = require("../models/admin");
const { User } = require("../models/user");
const MongoClient = require("mongodb").MongoClient;
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const url = serverConfig.mongoDB;
const { adminAuth } = require("../middlewares/adminAuth");

router.get("/", adminView);
router.post("/", adminLogin);
router.put("/", adminSignUp);
router.get("/dashboard", adminAuth, adminDashboardView);

async function adminView(req, res, next) {
    try {
        res.render("adminLogIn", { error: "" });
        next();
    } catch (error) {
        res.json({
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
        });
    }
}

async function adminLogin(req, res, next) {
    try {
        const { error } = validateLogin({
            email: req.body.email.toLowerCase(),
            password: req.body.password,
        });
        if (error) {
            res.render("adminLogIn", {
                error: `${error}`,
            });
        } else {
            let admin = await Admin.findOne({
                email: req.body.email.toLowerCase(),
            });
            if (!admin) {
                res.render("adminLogIn", {
                    error: "نام کاربری یا رمز عبور اشتباه است",
                });
            } else {
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    admin.password
                );
                if (validPassword) {
                    const token = admin.generateAuthToken();
                    res.redirect(`/admin/dashboard?adminToken=${token}`);
                } else {
                    res.render("adminLogIn", {
                        error: "نام کاربری یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        res.render("adminLogIn", {
            error: `${error}`,
        });
    }
}

async function adminSignUp(req, res, next) {
    try {
        const { error } = validate(req.body);
        let { firstName, lastName, email, password } = req.body;
        if (error) {
            return res.json({
                error: `${error}`,
            });
        } else {
            let AdminWithThisEmail = await Admin.findOne({
                email: email.toLowerCase(),
            });
            if (AdminWithThisEmail) {
                return res.json({
                    error: "با این ایمیل قبلا ثبت نام شده است",
                });
            } else {
                let admin = new Admin({
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                    email: email.toLowerCase(),
                    password: password,
                });
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
                await admin.save();
                const token = admin.generateAuthToken();
                return res.json({
                    adminToken: token,
                });
            }
        }
        next();
    } catch (error) {
        res.json({
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
        });
    }
}

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
            .find(lastMonthSalesQuery, { "userStore.storePlan.planPrice": 1 })
            .toArray();
        lastMonthSales.forEach((sale) => {
            lastMonthSalesTotalPrice =
                lastMonthSalesTotalPrice + sale.userStore.storePlan.planPrice;
        });
        let totalSales = await ecommerce
            .collection(collectionName)
            .find({}, { "userStore.storePlan.planPrice": 1 })
            .toArray();
        totalSales.forEach((sale) => {
            totalPrice = totalPrice + sale.userStore.storePlan.planPrice;
        });
        client.close();

        let numberOfUsers = await User.find({}).countDocuments();

        let users = await User.find({}).sort({ _id: -1 }).limit(5);
        res.render("adminDashboard", {
            numberOfUsers: numberOfUsers,
            users: users,
            adminInfo: req.admin.adminName,
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
module.exports = router;
