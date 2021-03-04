const jwt = require("jsonwebtoken");
const config = require("config");
const serverConfig = config.get("serverConfig.config");
const { User } = require("../models/user");

module.exports.auth = async function (req, res, next) {
    try {
        const token = req.query.userToken || req.query.userTokenHide;
        if (!token) {
            return res.render("logIn", {
                error: "مشکلی پیش آمده است، مجددا تلاش کنید",
            });
        } else {
            const decoded = jwt.verify(token, serverConfig.jwtPrivateKey);
            req.user = await User.findOne({
                _id: decoded._id,
            });
        }
        next();
    } catch (error) {
        res.render("logIn", { error: "مشکلی پیش آمده است، مجددا تلاش کنید" });
        // res.render("login",{error: error});
    }
};
