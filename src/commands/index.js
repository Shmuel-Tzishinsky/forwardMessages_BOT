const { Composer } = require("grammy");

require("./middleware");
const start = require("./handler/start");
const callback_query = require("./handler/callback_query");
const connect = require("./handler/connect");
const getchanel = require("./handler/getchanel");
const getuser = require("./handler/getuser");
const forward = require("./handler/forward");
const getgroup = require("./handler/getgroup");
const { createConversation } = require("@grammyjs/conversations");
const { login, logout, getGroup, getChannel, getUser } = require("./middleware");
const msg = require("./handler/msg");

const composer = new Composer();

composer.use(createConversation(login));
// composer.use(createConversation(logout))
composer.use(createConversation(getGroup));
composer.use(createConversation(getChannel));
composer.use(createConversation(getUser));

composer.command("start", start);
composer.command("connect", connect);
composer.command("forward", forward);
composer.command("getuser", getuser);
composer.command("getgroup", getgroup);
composer.command("getchanel", getchanel);
composer.command("logout", logout);
// composer.command("context", forward);

composer.on("msg", msg);
composer.on("callback_query:data", callback_query);

module.exports = composer;
