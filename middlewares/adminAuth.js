const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/config");
const { Admin } = require("../models/admin");

module.exports.adminAuth = async function (request, response, next) {
    try {
        const token = request.query.adminToken || request.query.adminTokenHide;
        if (!token) {
            return response.render("adminLogIn", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            request.admin = await Admin.findOne({
                _id: decoded._id,
            });
        }
        next();
    } catch (error) {
        response.render("adminLogIn", {
            error: "مشکلی پیش آمده است، مجددا تلاش کنید",
        });
        // response.render("login",{error: error});
    }
};
