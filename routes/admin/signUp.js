const bcrypt = require("bcryptjs");
const { Admin, validate } = require("../../models/admin");

async function signup(request, response, next) {
    try {
        const { error } = validate(request.body);
        let { firstName, lastName, email, password } = request.body;
        if (error) {
            return response.json({
                error: `${error}`,
            });
        } else {
            let isAdmin = await Admin.findOne({
                email: email.toLowerCase(),
            });
            if (isAdmin) {
                return response.json({
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
                return response.json({
                    adminToken: token,
                });
            }
        }
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "PUT:/admin/signup",
        });
    }
}

exports.signup = signup;
