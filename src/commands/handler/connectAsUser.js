const { getSingleSession } = require("../../controllers/sessionController");
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");

const connectAsUser = async (idFromUser) => {
    let session = "";

    const IdDetected = await getSingleSession(idFromUser);

    return new Promise((resolve, reject) => {
        if (IdDetected == undefined) {
            return reject({
                code: 404,
                message: "לא נמצא חיבור קודם ריק, נא להירשם \n\n /connect <phone number>",
            });
        }

        if (IdDetected) {
            session = IdDetected.session;
        }
        console.log("session: " + session);

        const client = new TelegramClient(new StringSession(session), 24246000, `fb5a11dcfcd3c03498ae5b37a3a6fa33`, {
            connectionRetries: 5,
        });

        return resolve(client);
    });
};

const logoutAsUser = async () => {
    return new Promise((resolve, reject) => {
        const client = new TelegramClient(new StringSession(""), 24246000, `fb5a11dcfcd3c03498ae5b37a3a6fa33`, {
            connectionRetries: 5,
        });

        return resolve(client);
    });
};

module.exports = { connectAsUser, logoutAsUser };
