const bcrypt = require("bcryptjs");
const { Admin, validateLogin, validate } = require("../../models/admin");

async function adminlogInView(request, response, next) {
    try {
        response.render("adminLogIn", { error: "" });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/admin/logIn",
        });
    }
}

async function adminLogin(request, response, next) {
    try {
        const { error } = validateLogin({
            email: request.body.email.toLowerCase(),
            password: request.body.password,
        });
        if (error) {
            response.render("adminLogIn", {
                error: `${error}`,
            });
        } else {
            let admin = await Admin.findOne({
                email: request.body.email.toLowerCase(),
            });
            if (!admin) {
                response.render("adminLogIn", {
                    error: "نام کاربری یا رمز عبور اشتباه است",
                });
            } else {
                const validPassword = await bcrypt.compare(
                    request.body.password,
                    admin.password
                );
                if (validPassword) {
                    const token = admin.generateAuthToken();
                    response.redirect(`/admin/dashboard?adminToken=${token}`);
                } else {
                    response.render("adminLogIn", {
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
            address: "POST:/admin/logIn",
        });
    }
}

exports.adminlogInView = adminlogInView;
exports.adminLogin = adminLogin;
