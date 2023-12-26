const { User } = require("../models/user");

module.exports.subDomainChecker = async function (request, response, next) {
    try {
        let subDomain = request.headers["x-subdomain"];
        let domain = request.headers["x-host"];
        // let subDomain = request.headers["host"].split(".").slice(-2)[0];
        // let domain = request.headers["host"];
        domain = domain.replace(`${subDomain}.`, "");

        console.log("subDomain", subDomain);
        console.log("domain", domain);

        let localhost = request
            .header("host")
            .split(".")
            .slice(-2)[1]
            .split(":")[0];
        let localSubDomain = request.header("host").split(".").slice(-2)[0];
        if (!subDomain) {
            subDomain = localSubDomain;
        }
        if (domain === "tiaraplatform.ir" || localhost === "localhost") {
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
        } else {
            if (domain.startsWith("www.")) {
                domain = domain.substring(4);
            }
            let store = await User.findOne({
                "userStore.domain": domain,
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
        console.log(request);
        response.render("404");
    }
};
