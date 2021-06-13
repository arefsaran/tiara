const dotenv = require("dotenv");
const result = dotenv.config();
if (result.error) {
    throw result.error;
}
module.exports = {
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    MONGO_DB: process.env.MONGO_DB,
    ECOMMERCE_DB: process.env.ECOMMERCE_DB,
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    MERCHANT_ID: process.env.MERCHANT_ID,
};
