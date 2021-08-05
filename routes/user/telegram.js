const express = require("express");

const router = express.Router();

const axios = require("axios");

const url = "https://api.telegram.org/bot";

const apiToken = "{api-token-given-by-BotFather}";

// Endpoints

router.post("/", telegramBot);

async function telegramBot(request, response, next) {
    try {
        const chatId = request.body.message.chat.id;
        const sentMessage = request.body.message.text;
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
                    response.status(200).send(response);
                })
                .catch((error) => {
                    response.send(error);
                });
        } else {
            // if no hello present, just respond with 200
            response.status(200).send({});
        }
        next();
    } catch (error) {
        console.log({ error: error });
    }
}

module.exports = router;
