const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/config");
const { Admin } = require("../models/admin");

module.exports.adminAuth = async function (request, response, next) {
    try {
        const token = request.query.adminToken;
        if (!token) {
            return response.render("adminLogIn", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
            request.admin = await Admin.findOne({
                _id: decodedToken._id,
            });
        }
        next();
    } catch (error) {
        response.render("adminLogIn", {
            error: "مشکلی پیش آمده است، مجددا تلاش کنید",
        });
    }
};
