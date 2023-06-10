const textHelp = require("../../utils/textHelp.json");

const callback_query = async (ctx) => {
    const callbackData = ctx.callbackQuery?.data;
    switch (callbackData) {
        case "firstconnection":
            await ctx.reply(textHelp.firstConnection, {
                parse_mode: "Markdown",
                disable_web_page_preview: true,
            });
            break;
        default:
            break;
    }
    await ctx.answerCallbackQuery();
};

module.exports = callback_query;
