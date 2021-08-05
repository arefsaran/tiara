const { User } = require("../models/user");

module.exports.subDomainChecker = async function (request, response, next) {
    try {
        let subDomain = request.headers["x-subdomain"];
        let localSubDomain = request.header("host").split(".").slice(-2)[0];
        if (!subDomain) {
            subDomain = localSubDomain;
        }
        if (subDomain === "www" || subDomain == 0) {
            if (request.originalUrl === "/aboutUs") {
                return response.render("aboutUs");
            } else if (request.originalUrl === "/terms") {
                return response.render("terms");
            } else {
                return response.render("landing");
            }
        } else {
            let store = await User.findOne({
                "userStore.storeId": subDomain,
            });
            if (store) {
                request.store = store;
            } else {
                return response.render("404", {
                    error: "فروشگاه مورد نظر یافت نشد.",
                });
            }
        }
        next();
    } catch (error) {
        response.render("404");
    }
};
