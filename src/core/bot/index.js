const { Bot, session } = require("grammy");
const { conversations } = require("@grammyjs/conversations");

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(
  session({
    type: "multi",
    conversation: {}, // Can be left blank
  })
);
bot.use(conversations());

bot
  .init()
  .then((client) => {
    console.log(`Connected successfully ${bot.botInfo.username} - ${bot.botInfo.id}`);
  })
  .catch((err) => console.error(err));

// bot.api
//   .setMyCommands([
//     { command: "connect", description: "✨ פתח/הפעל את החשבון" },
//     { command: "forward", description: "⏩ הגדר העברה אוטומטית" },
//     { command: "getuser", description: "🔗 קבל את המזהה של המשתמשים שלך" },
//     { command: "getgroup", description: "🔗 קבל את המזהה של הקבוצות שלך" },
//     { command: "getchanel", description: "🔗 קבל את המזהה של הערוצים שלך" },
//     { command: "logout", description: "👋 נתק את החשבון" },
//   ])
//   .catch(console.log);

module.exports = { bot };
