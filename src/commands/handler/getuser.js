
const getuser = async (ctx)=> {
    await ctx.reply("🚫 אנא המתן רגע, אל תשלח דבר");
    await ctx.conversation.enter("getUser");
};

module.exports =  getuser;
