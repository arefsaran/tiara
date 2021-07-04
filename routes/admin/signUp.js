const bcrypt = require("bcryptjs");
const { Admin, validate } = require("../../models/admin");

async function adminSignUp(req, res, next) {
    try {
        const { error } = validate(req.body);
        let { firstName, lastName, email, password } = req.body;
        if (error) {
            return res.json({
                error: `${error}`,
            });
        } else {
            let AdminWithThisEmail = await Admin.findOne({
                email: email.toLowerCase(),
            });
            if (AdminWithThisEmail) {
                return res.json({
                    error: "با این ایمیل قبلا ثبت نام شده است",
                });
            } else {
                let admin = new Admin({
                    firstName: firstName.toLowerCase(),
                    lastName: lastName.toLowerCase(),
                    email: email.toLowerCase(),
                    password: password,
                });
                const salt = await bcrypt.genSalt(10);
                admin.password = await bcrypt.hash(admin.password, salt);
                await admin.save();
                const token = admin.generateAuthToken();
                return res.json({
                    adminToken: token,
                });
            }
        }
        next();
    } catch (error) {
        res.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "PUT:/admin/signUp",
        });
    }
}

exports.adminSignUp = adminSignUp;
