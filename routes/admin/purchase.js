const { User } = require("../../models/user");

async function users(request, response, next) {
    try {
        let resultUsers = await User.find({}).sort({ _id: -1 });
        response.render("users", {
            resultUsers: resultUsers,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            path: "GET:/admin/purchase",
        });
    }
}

exports.users = users;
