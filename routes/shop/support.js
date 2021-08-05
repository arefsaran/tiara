const express = require("express");
const router = express.Router();

router.get("/", supportView);

async function supportView(request, response, next) {
    try {
        response.render("support", { storeInfo: request.store.userStore });
        next();
    } catch (error) {
        response.json({
            status: 500,
            message: "The request could not be understood by the server",
            data: { error: error },
            address: "GET:/support",
        });
    }
}

module.exports = router;
