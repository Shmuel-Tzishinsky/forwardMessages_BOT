
const connect = async (ctx)=> {
    await ctx.conversation.enter("login");
};

module.exports =  connect;
