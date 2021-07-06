const { render } = require("ejs");
const { User } = require("../models/user");

module.exports.subDomainChecker = async function (req, res, next) {
    try {
        let subDomain = req.headers["x-subdomain"];
        let localSubDomain = req.header("host").split(".").slice(-2)[0];
        if (!subDomain) {
            subDomain = localSubDomain;
        }
        if (subDomain === "www" || subDomain == 0) {
            return res.render("landing");
        } else {
            let store = await User.findOne({
                "userStore.storeId": subDomain,
            });
            if (store) {
                req.store = store;
            } else {
                return res.render("404", {
                    error: "فروشگاه مورد نظر یافت نشد.",
                });
            }
        }
        next();
    } catch (error) {
        res.render("404");
        // res.render("login",{error: error});
    }
};
