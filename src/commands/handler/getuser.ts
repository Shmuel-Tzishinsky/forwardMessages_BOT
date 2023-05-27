/* eslint-disable prettier/prettier */
import { MyContext } from "../../core/bot";

const getuser = async (ctx: MyContext): Promise<void> => {
    await ctx.reply("🚫 אנא המתן רגע, אל תשלח דבר");
    await ctx.conversation.enter("getUser");
};

export default getuser;
