const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/config");
const { User } = require("../models/user");

module.exports.auth = async function (request, response, next) {
    try {
        const token = request.query.userToken || request.query.userTokenHide;
        if (!token) {
            return response.render("logIn", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            request.user = await User.findOne({
                _id: decoded._id,
            });
        }
        next();
    } catch (error) {
        response.render("logIn", {
            error: "مشکلی پیش آمده است، مجددا تلاش کنید",
        });
        // response.render("login",{error: error});
    }
};
