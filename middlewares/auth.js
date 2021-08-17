const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/config");
const { User } = require("../models/user");

module.exports.auth = async function (request, response, next) {
    try {
        const token = request.query.userToken || request.query.userTokenHide;
        if (!token) {
            return response.render("login", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
            request.user = await User.findOne({
                _id: decodedToken._id,
            });
        }
        next();
    } catch (error) {
        response.render("login", {
            error: "مشکلی پیش آمده است، مجددا تلاش کنید",
        });
    }
};
