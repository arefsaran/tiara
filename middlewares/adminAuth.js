const jwt = require("jsonwebtoken");
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const { Admin } = require("../models/admin");

module.exports.auth = async function (req, res, next) {
    try {
        const token = req.query.adminToken || req.query.adminTokenHide;
        if (!token) {
            return res.render("admin", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decoded = jwt.verify(token, serverConfig.jwtPrivateKey);
            req.admin = await Admin.findOne({
                _id: decoded._id,
            });
        }
        next();
    } catch (error) {
        res.render("admin", { error: "مشکلی پیش آمده است، مجددا تلاش کنید" });
        // res.render("login",{error: error});
    }
};
