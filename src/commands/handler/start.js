const { InlineKeyboard } = require("grammy");
const textHelp = require("../../utils/textHelp.json");

const start = async (ctx) => {
    const inlineKeyboard = new InlineKeyboard();
    inlineKeyboard.text("פתיחת חשבון 🔂", "firstconnection").row();

    try {
        await ctx.reply(`שלום ${ctx.from?.first_name || ctx.from?.username} 👋\n\n${textHelp.started}`, {
            reply_markup: inlineKeyboard,
        });
    } catch (error) {
        console.error("start error");
        console.error(error);
    }
};

module.exports = start;
