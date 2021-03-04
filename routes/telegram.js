const express = require("express");

const router = express.Router();

const axios = require("axios");

const url = "https://api.telegram.org/bot";

const apiToken = "{api-token-given-by-BotFather}";

// Endpoints

router.post("/", telegramBot);

async function telegramBot(req, res, next) {
    try {
        const chatId = req.body.message.chat.id;
        const sentMessage = req.body.message.text;
        // Regex for hello
        if (sentMessage.match(/hello/gi)) {
            axios
                .post(
                    `${url}${apiToken}/sendMessage`,

                    {
                        chat_id: chatId,

                        text: "hello back ?",
                    }
                )
                .then((response) => {
                    res.status(200).send(response);
                })
                .catch((error) => {
                    res.send(error);
                });
        } else {
            // if no hello present, just respond with 200
            res.status(200).send({});
        }
        next();
    } catch (error) {
        console.log({ error: error });
    }
}

module.exports = router;
