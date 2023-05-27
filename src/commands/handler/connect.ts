import { MyContext } from "../../core/bot";

const connect = async (ctx: MyContext): Promise<void> => {
    await ctx.conversation.enter("login");
};

export default connect;
