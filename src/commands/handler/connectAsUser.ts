/* eslint-disable prettier/prettier */
import { getSingleSession } from "../../controllers/sessionController";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";

const connectAsUser = async (idFromUser: number): Promise<TelegramClient> => {
  let session = "";

  const IdDetected = await getSingleSession( idFromUser)

  return new Promise((resolve, reject) => {
    if (IdDetected == undefined) {
      return reject({
        code: 404,
        message:
          "לא נמצא חיבור קודם ריק, נא להירשם \n\n /connect <phone number>",
      });
    }

    if (IdDetected) {
      session = IdDetected.session;
    }
    console.log("session: " + session);

    const client = new TelegramClient(
      new StringSession(session),
      parseInt(`${process.env.APP_ID}`),
      `${process.env.APP_HASH}`,
      {
        connectionRetries: 5,
      }
    );

    return resolve(client);
  });
};

const logoutAsUser = async(): Promise<TelegramClient> => {
  return new Promise((resolve, reject) => {
    const client = new TelegramClient(
      new StringSession(""),
      parseInt(`${process.env.APP_ID}`),
      `${process.env.APP_HASH}`,
      {
        connectionRetries: 5,
      }
    );

    return resolve(client);
  })
}

export { connectAsUser, logoutAsUser };
