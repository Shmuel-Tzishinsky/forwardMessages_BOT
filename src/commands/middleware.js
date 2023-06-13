const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { SaveStorage } = require("../utils/saveStorage");
const { connectAsUser } = require("./handler/connectAsUser");
const { loadWorkers } = require("../utils/forwardWorker");
const { NewMessage } = require("telegram/events");
const { getSingleSession, setSingleSession, deleteSessionAction } = require("../controllers/sessionController");
const translate = require("translate-google");
const { InlineKeyboard } = require("grammy");
require("dotenv").config();
let phoneCode = "";

let client = new TelegramClient(new StringSession(""), parseInt(process.env.APP_ID), process.env.APP_HASH, {
    connectionRetries: 5,
});

function isAsOnlyNumbers(p) {
    const digits = p.replace(/\D/g, "");
    return /^\d+$/.test(digits);
}

async function askPhoneCode(conversation, context) {
    try {
        await context.reply("נא להזין את קוד המשתמש שנשלח על ידי טלגרם ב-SMS/צ'אט\n\nלדוגמה, קוד הכניסה שלך הוא 123456 שלח אותו כך: mycode123456");
        const { message } = await conversation.wait();
        console.log("askPhoneCode: " + message?.text);
        if (message?.text?.includes(" "))
            throw {
                code: 500,
                message:
                    "שלחת את הקוד עם רווחים, אנא שלח את הקוד כך \n\nmycode<yourcode>\n\n'ללא רווחים', לניסיון חוזר אנא חזור על הפקודה\n\n/connect <phone number>",
            };

        if (!message?.text?.toString().toLowerCase().includes("mycode"))
            throw {
                code: 500,
                message: "אנא השתמש ב-\n**mycode<yourcode>**\nללא רווח אנא חזור על הפקודה,\n\n/connect <phone number>",
            };

        phoneCode = message.text.toLowerCase().replace("mycode", "").trim();

        return phoneCode.replace(/\s/g, "").trim();
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const checkAuthorized = async () => {
    try {
        await await client.invoke(new Api.updates.GetState());
        return true;
    } catch (e) {
        return false;
    }
};

async function login(conversation, context) {
    // const loadPhone = await context.reply("אנא המתן לעיבוד המספר...");
    await context.reply("אנא המתן לעיבוד המספר...");
    // const messageId = loadPhone.message_id;
    // const chatId = loadPhone.chat.id;

    try {
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "שגיאה, מזהה לא מוגדר",
            };
        }
        const IdDetected = await getSingleSession(context.from?.id);
        if (IdDetected != undefined) {
            await client.disconnect();
            client = await connectAsUser(context.from?.id);
        }
        console.log("Loading interactive example...");
        await client.connect();
        // const authorized = await client.isUserAuthorized();
        // console.log("🚀 ~ file: middleware.js:69 ~ login ~ authorized:", authorized);

        let authorized = await checkAuthorized();
        console.log("🚀 ~ file: middleware.js:72 ~ login ~ authorized:", authorized);

        if (authorized && IdDetected != undefined) {
            // await bot.api.deleteMessage(chatId, messageId);

            await context.reply("אתה מחובר 👌");
            await observeClientChat(context);
            return;
        }

        const phoneNumber = context.match;
        if (!phoneNumber.length || !isAsOnlyNumbers(phoneNumber)) {
            // await bot.api.deleteMessage(chatId, messageId);

            throw {
                code: 404,
                message: "אופס לא נמצא מספר טלפון או שמספר הטלפון אינו חוקי\n\nלחץ בבקשה על\n /connect <phone number>",
            };
        }
        const auth = await client.sendCode(
            {
                apiHash: process.env.APP_HASH,
                apiId: parseInt(process.env.APP_ID),
            },
            `${phoneNumber}`,
        );
        const phoneCode = await askPhoneCode(conversation, context);

        await client.invoke(
            new Api.auth.SignIn({
                phoneNumber: `${phoneNumber}`,
                phoneCodeHash: auth.phoneCodeHash,
                phoneCode: phoneCode.toString().trim().replace(/\s/g, ""),
            }),
        );

        // console.log(client.session.save()); // Save this string to avoid logging in again

        await setSingleSession({
            id: context.from.id,
            name: context.from.first_name,
            session: client.session.save(),
            dialogs: [],
            isBot: context.from.is_bot,
        });

        // await bot.api.deleteMessage(chatId, messageId);
        await context.reply("נרשמת בהצלחה!");
        await client.disconnect();
    } catch (error) {
        if (Number.isInteger(error.code) || error.seconds == undefined) {
            const inlineKeyboard = new InlineKeyboard();
            inlineKeyboard.text("מדריך פתיחת חשבון", "firstconnection").row();

            await context.reply(error?.message || "something wen't wrong", {
                reply_markup: inlineKeyboard,
            });
        }

        if (error.seconds) {
            await context.reply(`הצפה: הגעת לגבול, חכה ${error.seconds} שניות`);
        }

        await client.disconnect();
        console.log(error);
    }

    return;
}

async function logout(context) {
    try {
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "מצטער לא הושלם!, מזהה ריק",
            };
        }
        let authorized = await checkAuthorized();
        console.log("🚀 ~ file: middleware.js:160 ~ logout ~ authorized:", authorized);
        if (authorized) await client.invoke(new Api.auth.LogOut());

        const result = await deleteSessionAction(context.from.id);
        if (result || authorized) {
            context.reply("ההפעלה נמחקה בהצלחה");
        } else {
            context.reply("אופס נראה שעדיין לא התחברת");
        }
    } catch (error) {
        console.log(error);
        context.reply(error?.message);
    }

    return;
}

async function getGroup(conversation, context) {
    try {
        await client.disconnect();
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "מצטער getGroup לא הושלם!, מזהה ריק",
            };
        }
        client = await connectAsUser(context.from.id);
        await client.connect();

        // const groupFromDB = getGroupDB(context.from.id);
        // if (groupFromDB.length != 0 && context.match != "update") {
        //   // check in db
        //   await client.disconnect();
        //   return  await splitEndSendDialogData(context, groupFromDB)

        // }

        // create newDialogs in session.js
        const dialogs = await client.getDialogs();
        const groups = [];
        let ind = 0;
        const dialogsData = dialogs.map((dialog) => {
            if (dialog.isGroup) {
                const data = {
                    id: dialog.id,
                    folderId: Math.abs(parseInt(dialog.entity?.migratedTo?.channelId?.value || dialog.entity.id.value)), // Math.abs(parseInt(`${dialog.id}`)),
                    title: dialog.entity.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel,
                };

                groups.push(data);

                return [
                    `${ind++}). [${dialog.entity.title}](https://t.me/c/${Math.abs(
                        parseInt(`${dialog.entity?.migratedTo?.channelId?.value || dialog.entity.id.value}`),
                    )}/99999999) >> \r\r \`${dialog.id}\` \n`,
                ];
            }
        });

        // save to storage
        // await SaveStorage.updateDialogs(context.from.id, "session", groups);
        await splitEndSendDialogData(context, dialogsData);
    } catch (error) {
        if (error.code) {
            context.reply(error.message);
        }
        console.log(error);
    }
    await client.disconnect();
    return;
}

async function getChannel(conversation, context) {
    try {
        await client.disconnect();
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "מצטער getChanel לא הושלם!, מזהה ריק",
            };
        }
        client = await connectAsUser(context.from.id);
        await client.connect();

        // const channelDB = getChanelDB(context.from.id);
        // if (channelDB.length != 0 && context.match != "update") {
        //   // check in db
        //   await client.disconnect();
        //   return await splitEndSendDialogData(context, channelDB)
        // }

        const channels = [];
        const dialogs = await client.getDialogs();
        let ind = 0;
        const dialogsData = dialogs.map((dialog) => {
            if (dialog.isChannel && !dialog.isGroup) {
                channels.push({
                    id: dialog.id,
                    folderId: Math.abs(parseInt(dialog.entity?.migratedTo?.channelId?.value || dialog.entity.id.value)), // Math.abs(parseInt(`${dialog.id}`)),
                    title: dialog.entity.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel,
                });

                return [
                    `${ind++}). [${dialog.entity.title}](https://t.me/c/${Math.abs(
                        parseInt(`${dialog.entity?.migratedTo?.channelId?.value || dialog.entity.id.value}`),
                    )}/99999999) >> \r\r \`${dialog.id}\` \n`,
                ];
            }
        });

        // save to storage
        // await SaveStorage.updateDialogs(context.from.id, "session", channels);
        await splitEndSendDialogData(context, dialogsData);
    } catch (error) {
        if (error.code) {
            context.reply(error.message);
        }
        console.error(error);
    }
    await client.disconnect();
    return;
}

async function getUser(conversation, context) {
    try {
        await client.disconnect();
        if (context.from == undefined) {
            throw {
                code: 404,
                message: "מצטער getUser לא הושלם!, מזהה ריק",
            };
        }
        client = await connectAsUser(context.from.id);
        await client.connect();

        // const userDB = getUserDB(context.from.id);
        // if (userDB.length != 0 && context.match != "update") {
        //   // check in db
        //   // await client.disconnect()
        //   console.log("if userDB");
        //   return await context.reply(
        //     textHelp.textGetChannel + userDB.toString().replaceAll(",", ""),
        //     { parse_mode: "Markdown" }
        //   );
        // }

        const users = [];
        const dialogs = await client.getDialogs();
        let ind = 0;
        const dialogsData = dialogs.map((dialog) => {
            if (dialog.isChannel == false && dialog.isGroup == false && dialog.isUser === true) {
                users.push({
                    id: dialog.id,
                    folderId: Math.abs(parseInt(dialog.entity?.migratedTo?.channelId?.value || dialog.entity.id.value)), // Math.abs(parseInt(`${dialog.id}`)),
                    title: dialog.entity.title,
                    isGroup: dialog.isGroup,
                    isChannel: dialog.isChannel,
                });

                return [`${ind++}). [${dialog.name}](tg://user?id=${Math.abs(parseInt(dialog.id || dialog.entity.id.value))}) >> \r\r \`${dialog.id}\` \n`];
            }
        });

        // save to storage
        // await SaveStorage.updateDialogs(context.from.id, "session", channels);
        await splitEndSendDialogData(context, dialogsData);

        // // create newDialogs in session.js
        // const users= [];
        // const dialogs = await client.getDialogs();
        // const dialogsData = dialogs.map((dialog) => {
        //   if (dialog.isChannel == false && dialog.isGroup == false) {
        //     users.push({
        //       id: dialog.id,
        //       folderId: Math.abs(parseInt(`${dialog.id}`)),
        //       title: dialog.title,
        //       isGroup: dialog.isGroup,
        //       isChannel: dialog.isChannel,
        //     });
        //     return `[${dialog.title}](https://t.me/c/${Math.abs(
        //       parseInt(`${dialog.id}`)
        //     )}/999999999) => ${dialog.id}\n`;
        //   }
        // });

        // // save to storage
        // // await SaveStorage.updateDialogs(context.from.id, "session", users);
        // await context.reply(
        //   textHelp.textGetChannel + dialogsData.toString().replaceAll(",", ""),
        //   { parse_mode: "Markdown" }
        // );
    } catch (error) {
        if (error.code) {
            context.reply(error.message);
        }
        console.error(error);
    }
    // await client.disconnect()
    return;
}

async function observeClientChat(context) {
    if (context.from == undefined) {
        return;
    }

    const resultWorker = loadWorkers(context.from.id)[0];
    if (resultWorker == undefined) return;

    for (const from of resultWorker.from) {
        for (const to of resultWorker.to) {
            console.log("enter for in FROM " + from + " to " + to);
            //   await ctx.forwardMessage(to , from)
            client.addEventHandler(async (event) => {
                const message = event.message;
                if (message.senderId != undefined) {
                    try {
                        const getMev2 = await client.getEntity(message.senderId);
                        // console.log("message.senderId: ", message.senderId);
                        // console.log("message.message: ", message.message);
                        // console.log("message.fromId: ", message.fromId);
                        // console.log("message.id: ", message.id);
                        // console.log("message.sender: ", message.sender);
                        // console.log("getMev2: ", getMev2);
                        // const getCha= await message.getSender();
                        // console.log("🚀 ~ file: middleware.ts:354 ~ client.addEventHandler ~ getChat:", getChat)
                        console.log("====================================");
                        console.log(message.message?.length);
                        console.log(message.message);
                        console.log("====================================");
                        const translateText = message.message?.length ? await translate(message.message, { to: "iw" }) : "";
                        if (message?.media?.photo || message?.media?.document?.mimeType === "video/mp4") {
                            const buffer = await client.downloadMedia(message?.media?.photo || message?.media?.document);
                            buffer.name = `file.${message?.media?.photo ? "png" : "mp4"}`;
                            await client.sendFile(to, {
                                file: buffer,
                                caption: `קישור להודעה: <a href="https://t.me/c/${from}/${message.id}">${
                                    getMev2["title"] || getMev2["firstName"]
                                }</a>\n\n ${translateText}`,
                                parseMode: "html",
                            });
                        } else if (message.message.length) {
                            await client.sendMessage(to, {
                                message: `קישור להודעה: <a href="https://t.me/c/${from}/${message.id}">${
                                    getMev2["title"] || getMev2["firstName"]
                                }</a>\n\n ${translateText}`,
                                parseMode: "html",
                            });
                        }
                        // await client.forwardMessages(to, {
                        //   messages: message,
                        //   fromPeer: "",
                        // })
                        // dropAuthor: true,
                        // noforwards: true,
                    } catch (error) {
                        console.log(error);

                        if (Number.isInteger(error.error_code)) {
                            await context.reply(`נראה שרובוטים עדיין לא הצטרפו [group/channel](https://t.me/c/${to.replace("-100", "")})`, {
                                parse_mode: "Markdown",
                            });
                        }
                    }
                    // await context.forwardMessage(2026146290 , Number(message.senderId))
                    //  await bot.api.forwardMessage(2026146290, message.senderId, message.chatId)
                }
            }, new NewMessage({ fromUsers: from }));
        }
    }
}

const splitEndSendDialogData = async (contex, textArray) => {
    const splitAtRow = textArray.filter((n) => n).slice("\n");
    const chunkSize = 50;
    for (let i = 0; i < splitAtRow.length; i += chunkSize) {
        const chunk = splitAtRow.slice(i, i + chunkSize);
        await context.reply(chunk.toString().replaceAll(",", ""), { parse_mode: "Markdown" });
    }
    return;
};
// Split messages into chunks of 4096 characters or less to avoid Telegram's message length limit
function splitMessage(msg) {
    console.log(`Splitting message of length ${msg.length}`);
    const max_size = 3900;
    const amount_sliced = Math.ceil(msg.length / max_size);
    let start = 0;
    let end = max_size;
    const chunks = [];

    for (let i = 0; i < amount_sliced; i++) {
        chunks.push(msg.slice(start, end));
        start += max_size;
        end += max_size;
    }

    return chunks;
}

module.exports = {
    login,
    logout,
    getChannel,
    getUser,
    getGroup,
    observeClientChat,
};
