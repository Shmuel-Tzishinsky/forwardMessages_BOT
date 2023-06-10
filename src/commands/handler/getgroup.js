/* eslint-disable prettier/prettier */
const textHelp = require("../../utils/textHelp.json");

const getgroup = async (ctx) => {
    await ctx.reply(textHelp.textGetGroup);
    await ctx.conversation.enter("getGroup");
};

module.exports =  getgroup;
