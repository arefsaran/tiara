const { User } = require("../../models/user");

async function usersView(request, response, next) {
    try {
        let resultUsers = await User.find({}).sort({ _id: -1 });
        response.render("usersView", {
            resultUsers: resultUsers,
        });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/admin/purchase",
        });
    }
}

exports.usersView = usersView;
