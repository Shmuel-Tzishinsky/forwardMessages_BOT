require("./src/core/db/index");
const commands = require("./src/commands");
const { bot } = require("./src/core/bot");
const { development } = require("./src/utils/launch");
require("dotenv").config();
//production
const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

bot.use(commands);

process.env.NODE_ENV === "development" ? development(bot) : production(bot);
