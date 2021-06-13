const jwt = require("jsonwebtoken");
const { JWT_PRIVATE_KEY } = require("../config/config");
const { Admin } = require("../models/admin");

module.exports.adminAuth = async function (req, res, next) {
    try {
        const token = req.query.adminToken || req.query.adminTokenHide;
        if (!token) {
            return res.render("adminLogIn", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decoded = jwt.verify(token, JWT_PRIVATE_KEY);
            req.admin = await Admin.findOne({
                _id: decoded._id,
            });
        }
        next();
    } catch (error) {
        res.render("adminLogIn", {
            error: "مشکلی پیش آمده است، مجددا تلاش کنید",
        });
        // res.render("login",{error: error});
    }
};
