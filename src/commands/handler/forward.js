/* eslint-disable prettier/prettier */
const { checkWorker, resultSplitId, saveToStorage } = require("../../utils/forwardWorker");
const textHelp = require("../../utils/textHelp.json");

/**
 * setup forward from -> to [SAVE TO JSON]
 * @param ctx  from converstation core\bot\index.ts
 * @returns Promise<void>
 */
const forward = async (ctx) => {
    if (ctx.chat?.type != "private") {
        await ctx.reply(textHelp.pleasePrivateChat + ` [${ctx.me.username}](tg://user?id=${ctx.me.id})`, {
            parse_mode: "Markdown",
        });
        return;
    }
    const argCommand = ctx.match?.toString().toLowerCase().replace(/\s+/g, " ").trim();
    if (argCommand == undefined || ctx.from == undefined) {
        await ctx.reply("פקודה לא נמצאה!");
        return;
    }

    const argAction = argCommand.split(" ")[0]; // ACTION
    const argLabel = argCommand.split(" ")[1]; // LABEL / WORKER

    try {
        if (argCommand == "") {
            await ctx.reply(textHelp.forward);
            return;
        }

        if (!argAction.includes("add")) {
            await ctx.reply(textHelp.addNotInclude);
            return;
        }

        if ( /^\d+$/.test(argLabel)) {
            await ctx.reply(textHelp.forwardLabelNotInclude);
            return;
        }

        if (checkWorker(argLabel, ctx.from.id)) {
            await ctx.reply("המשימות זמינות");
            return;
        }

        const { froms, toMany } = resultSplitId(argAction, argLabel, argCommand);
        console.log(froms, toMany);
        const result = saveToStorage({
            from: froms,
            to: toMany,
            id: ctx.from?.id,
            name: ctx.from?.first_name,
            worker: argLabel?.toString(),
        });

        if (result) {
            ctx.reply(`עובדים זמינים`);
            return;
        } else {
            ctx.reply(`מצטער הייתה שגיאה, ודא שהיא מתאימה לפורמט`);
            return;
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = forward;
