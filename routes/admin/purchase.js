const { User } = require("../../models/user");

async function usersView(req, res, next) {
    try {
        let resultUsers = await User.find({}).sort({ _id: -1 });
        res.render("usersView", {
            resultUsers: resultUsers,
        });
        next();
    } catch (error) {
        res.json({
            code: 500,
            status: "failed",
            comment: "Error!",
            data: { error: error },
        });
    }
}

exports.usersView = usersView;
