const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const { Message } = require("../../models/message");
const {
    DATABASE_ADDRESS,
    SECRET_KEY_RECAPTCHA,
    DATABASE_NAME,
} = require("../../config/config");
const fetch = require("node-fetch");
const { stringify } = require("querystring");

router.get("/", homeView);
router.get("/contactUs", contactUs);
router.post("/contactUs", saveUserMessage);

async function homeView(request, response, next) {
    try {
        let collectionName = "categories";
        let storeId = request.store.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let databaseClient = client.db(DATABASE_NAME);
        let categories = await databaseClient
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let resultBanner = await databaseClient
            .collection("banners")
            .find({ storeId: storeId })
            .toArray();
        return response.render("home", {
            categories: categories,
            resultBanner: resultBanner,
            storeInfo: request.store.userStore,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/",
        });
    }
}

async function contactUs(request, response, next) {
    try {
        response.render("contactUs", { message: "" });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/landing",
        });
    }
}

async function saveUserMessage(request, response, next) {
    try {
        if (!request.body["g-recaptcha-response"]) {
            return response.render("contactUs", {
                message: "لطفا تیک من ربات نیستم را بزنید",
            });
        }
        let { name, phone, subject, text } = request.body;
        // Verify URL
        const query = stringify({
            secret: SECRET_KEY_RECAPTCHA,
            response: request.body["g-recaptcha-response"],
            remoteip: request.connection.remoteAddress,
        });
        const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;
        // Make a request to verifyURL
        const body = fetch(verifyURL).then((response) => response.json());
        // If not successful
        if (body.success !== undefined && !body.success) {
            return response.render("contactUs", {
                message: "صفحه را refresh کنید",
            });
        }
        let message = new Message({
            name: name,
            phone: phone,
            subject: subject,
            text: text,
        });
        await message.save();
        return response.render("contactUs", {
            message: "پیام شما با موفقیت ارسال شد",
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/",
        });
    }
}

module.exports = router;
