const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
module.exports = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_ADDRESS: process.env.DATABASE_ADDRESS,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    MERCHANT_ID: process.env.MERCHANT_ID,
    SITE_KEY_RECAPTCHA: process.env.SITE_KEY_RECAPTCHA,
    SECRET_KEY_RECAPTCHA: process.env.SECRET_KEY_RECAPTCHA,
};
