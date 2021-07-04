const bcrypt = require("bcryptjs");
const { Admin, validateLogin, validate } = require("../../models/admin");

async function adminlogInView(req, res, next) {
    try {
        res.render("adminLogIn", { error: "" });
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/admin/logIn",
        });
    }
}

async function adminLogin(req, res, next) {
    try {
        const { error } = validateLogin({
            email: req.body.email.toLowerCase(),
            password: req.body.password,
        });
        if (error) {
            res.render("adminLogIn", {
                error: `${error}`,
            });
        } else {
            let admin = await Admin.findOne({
                email: req.body.email.toLowerCase(),
            });
            if (!admin) {
                res.render("adminLogIn", {
                    error: "نام کاربری یا رمز عبور اشتباه است",
                });
            } else {
                const validPassword = await bcrypt.compare(
                    req.body.password,
                    admin.password
                );
                if (validPassword) {
                    const token = admin.generateAuthToken();
                    res.redirect(`/admin/dashboard?adminToken=${token}`);
                } else {
                    res.render("adminLogIn", {
                        error: "نام کاربری یا رمز عبور اشتباه است",
                    });
                }
            }
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "POST:/admin/logIn",
        });
    }
}

exports.adminlogInView = adminlogInView;
exports.adminLogin = adminLogin;
