/* eslint-disable prettier/prettier */
import { MyContext } from "../../core/bot";
import * as textHelp from "../../utils/textHelp.json";

const getgroup = async (ctx: MyContext): Promise<void> => {
    await ctx.reply(textHelp.textGetGroup);
    await ctx.conversation.enter("getGroup");
};

export default getgroup;
