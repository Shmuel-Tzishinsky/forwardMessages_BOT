const textHelp = require("../../utils/textHelp.json");

const getchanel = async (ctx) => {
    await ctx.reply(textHelp.textGetChannel);
    await ctx.reply("🚫 אנא המתן רגע, אל תשלח דבר");
    await ctx.conversation.enter("getChannel");
};

module.exports = getchanel;
