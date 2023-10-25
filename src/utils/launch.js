const { webhookCallback } = require("grammy");
const express = require("express");

const production = async (bot) => {
  try {
    const app = express();
    app.use(express.json());
    app.use(webhookCallback(bot, "express"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Bot listening on port ${PORT}`);
    });
    console.log(`[SERVER] Bot starting webhook`);
  } catch (e) {
    console.error(e);
  }
};

const development = async (bot) => {
  try {
    // await bot.api.deleteWebhook();
    console.log("[SERVER] Bot starting polling");
    await bot.start();
  } catch (e) {
    console.log(e);
  }
};

module.exports = { production, development };
