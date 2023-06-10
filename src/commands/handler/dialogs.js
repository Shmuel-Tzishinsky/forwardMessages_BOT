const { SaveStorage } = require("../../utils/saveStorage");

/**
 *
 * @param idFromUser is  ID from your telegram account
 * @returns list string of channel in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from
 * the database and displaying it to the user
 */
function getChanelDB(idFromUser) {
    const filePath = SaveStorage.checkSessionExist("session");
    const sessionData = SaveStorage.loadSession(filePath);
    const searchSessionCurrent = sessionData.filter(({ id }) => id == idFromUser)[0];
    if (searchSessionCurrent == undefined)
        throw {
            code: 404,
            message: "נראה שאתה לא מחובר, השתמש ב-/connect כדי להתחבר",
        };
    const searchGroup = searchSessionCurrent.dialogs.filter(({ isChannel }) => isChannel == true);
    console.log(searchGroup);
    if (searchGroup.length == 0) {
        return [];
    }

    return searchGroup.map((item) => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`);
}

/**
 *
 * @param idFromUser is  ID from your telegram account
 * @returns list string of group in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from
 * the database and displaying it to the user
 */
function getGroupDB(idFromUser) {
    const filePath = SaveStorage.checkSessionExist("session");
    const sessionData = SaveStorage.loadSession(filePath);
    const searchSessionCurrent = sessionData.filter(({ id }) => id == idFromUser)[0];

    if (searchSessionCurrent == undefined)
        throw {
            code: 404,
            message: "נראה שאתה לא מחובר, השתמש ב-/connect כדי להתחבר",
        };
    const searchGroup = searchSessionCurrent.dialogs.filter(({ isGroup }) => isGroup == true);

    if (searchGroup.length == 0) {
        return [];
    }

    return searchGroup.map((item) => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`);
}

/**
 *
 * @param idFromUser is  ID from your telegram account
 * @returns list string of user in your account (NOT BOT ACCOUNT)
 * @method This is useful for fetching a user from
 * the database and displaying it to the user
 */

function getUserDB(idFromUser) {
    const filePath = SaveStorage.checkSessionExist("session");
    const sessionData = SaveStorage.loadSession(filePath);
    const searchSessionCurrent = sessionData.filter(({ id }) => id == idFromUser)[0];
    if (searchSessionCurrent == undefined)
        throw {
            code: 404,
            message: "נראה שאתה לא מחובר, השתמש ב-/connect כדי להתחבר",
        };
    const searchPrivateChat = searchSessionCurrent.dialogs.filter(({ isGroup, isChannel }) => isGroup == false && isChannel == false);
    if (searchPrivateChat.length == 0) {
        return [];
    }

    return searchPrivateChat.map((item) => `\n[${item.title}](https://t.me/c/${item.folderId}/999999999) => ${item.id}`);
}

module.exports = { getUserDB, getGroupDB, getChanelDB };
