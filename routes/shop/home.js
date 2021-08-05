const express = require("express");
const router = express.Router();
const MongoClient = require("mongodb").MongoClient;
const {
    DATABASE_ADDRESS,
    SECRET_KEY_RECAPTCHA,
    EMAIL_PASSWORD,
    DATABASE_NAME,
} = require("../../config/config");
const nodemailer = require("nodemailer");
const fetch = require("node-fetch");
const { stringify } = require("querystring");

router.get("/", homeViewFunction);
router.get("/contactUs", contactUs);
router.post("/", sendEmail);

async function contactUs(request, response, next) {
    try {
        response.render("contactUs");
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/landing",
        });
    }
}
async function homeViewFunction(request, response, next) {
    try {
        let collectionName = "categories";
        let storeId = request.store.userStore.storeId;
        const client = await MongoClient.connect(DATABASE_ADDRESS, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        let ecommerce = client.db(DATABASE_NAME);
        let resultCategories = await ecommerce
            .collection(collectionName)
            .find({ storeId: storeId })
            .toArray();
        let resultBanner = await ecommerce
            .collection("banners")
            .find({ storeId: storeId })
            .toArray();
        return response.render("home", {
            resultCategories: resultCategories,
            resultBanner: resultBanner,
            storeInfo: request.store.userStore,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/",
        });
    }
}

async function sendEmail(request, response, next) {
    try {
        console.log("request.body", request.body);
        console.log("request.query", request.query);
        if (!request.body.captcha) {
            return response.json({
                success: false,
                msg: "لطفا تیک من ربات نیستم را بزنید",
            });
        }
        // Verify URL
        const query = stringify({
            secret: SECRET_KEY_RECAPTCHA,
            response: request.body.captcha,
            remoteip: request.connection.remoteAddress,
        });
        const verifyURL = `https://google.com/recaptcha/api/siteverify?${query}`;

        // Make a request to verifyURL
        const body = fetch(verifyURL).then((response) => response.json());
        // If not successful
        if (body.success !== undefined && !body.success) {
            return response.json({
                success: false,
                msg: "Failed captcha verification",
            });
        }
        let {
            customerName,
            customerEmail,
            customerSubject,
            customerMessage,
        } = request.body;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "Gmail",
            secure: false, // true for 465, false for other ports
            auth: {
                user: "tiaraplatform@gmail.com", // generated ethereal user
                pass: EMAIL_PASSWORD, // generated ethereal password
            },
        });

        let message = {
            from: customerEmail, // sender address
            to: "tiaraplatform@gmail.com", // list of receivers
            subject: customerSubject, // Subject line
            text: ``, // plain text body
            html: `Customer Name :<strong> ${customerName}</strong> + Customer Email :<strong> ${customerEmail}</strong> + Customer Message : <strong>${customerMessage}</strong>`, // html body
        };

        let replyMessage = {
            from: "tiaraplatform@gmail.com", // sender address
            to: customerEmail, // list of receivers
            subject: "پلتفرم تیارا", // Subject line
            text: ``, // plain text body
            html: `<p>سلام <strong> ${customerName}</strong> ممنون بابت ارسال پیام، به زودی پاسخ خواهیم داد</p>`, // html body
        };

        // send mail with defined transport object
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log("Error occurred");
                console.log(error.message);
                return process.exit(1);
            }
            console.log("Message sent successfully!");
            // only needed when using pooled connections
            transporter.close();
        });
        transporter.sendMail(replyMessage, (error, info) => {
            if (error) {
                console.log("Error occurred");
                console.log(error.message);
                return process.exit(1);
            }
            console.log("replyMessage sent successfully!");
            // only needed when using pooled connections
            transporter.close();
        });
        let msgSend = "پیام شما با موفقیت ارسال شد";
        return response.json({ success: false, msg: msgSend });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/",
        });
    }
}

module.exports = router;
