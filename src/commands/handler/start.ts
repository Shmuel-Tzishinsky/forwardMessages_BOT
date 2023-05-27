import { MyContext } from "../../core/bot";
import { InlineKeyboard } from "grammy";
import * as textHelp from "../../utils/textHelp.json";

const start = async (ctx: MyContext): Promise<void> => {
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

export default start;
