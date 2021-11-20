const bcrypt = require("bcryptjs");
const { Admin, validateLogin } = require("../../models/admin");

async function loginView(request, response, next) {
    try {
        response.render("adminLogin", { error: "" });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/admin/login",
        });
    }
}

async function login(request, response, next) {
    try {
        const { error } = validateLogin({
            email: request.body.email.toLowerCase(),
            password: request.body.password,
        });
        if (error) {
            response.render("adminLogin", {
                error: `${error}`,
            });
        } else {
            let admin = await Admin.findOne({
                email: request.body.email.toLowerCase(),
            });
            if (!admin) {
                response.render("adminLogin", {
                    error: "نام کاربری یا رمز عبور اشتباه است",
                });
            } else {
                const isValidPassword = await bcrypt.compare(
                    request.body.password,
                    admin.password
                );
                if (isValidPassword) {
                    const token = admin.generateAuthToken();
                    response.redirect(`/admin/dashboard?adminToken=${token}`);
                } else {
                    response.render("adminLogin", {
                        error: "نام کاربری یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "POST:/admin/login",
        });
    }
}

exports.loginView = loginView;
exports.login = login;
