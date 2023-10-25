const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "j3nc08jqaf9w",
  }),
  puppeteer: {
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    args: ["--no-sandbox"],
  },
  takeoverOnConflict: true,
  qrMaxRetries: 100,
});

const qrCode = require("qrcode-terminal");
const { login } = require("../commands/middleware");

client.on("qr", (qr) => {
  // QR code is generated, scan it with your WhatsApp mobile app
  console.log("Scan the QR code to authenticate.");
  console.log(qr);
  qrCode.generate(qr, { small: true }, function (qrCode) {
    console.log(qrCode);
  });
});

client.on("ready", () => {
  console.log("WhatsApp Web client is ready.");

  //   client.getChats().then((e) => {
  //     console.log(e);
  //   });
  // Send a text message
  login();
});

client.initialize();

// You can add more event listeners and error handling as needed
const sendMessage = async (msg) => {
  try {
    const recipient = "120363193293959166@g.us";
    let message = await client.sendMessage(recipient, msg, {
      linkPreview: false,
    });
    return;
  } catch (error) {
    console.error("Error sending message: ", error);
  }
};

const sendMediaWhatsapp = async (content, options = {}) => {
  console.log("🚀 ~ file: whatsapp.js:51 ~ sendMediaWhatsapp ~ content:", content);
  try {
    const recipient = "120363193293959166@g.us";
    const messageMedia = new MessageMedia(content.mimetype, content.data, content.filename, content.filesize);
    await client.sendMessage(recipient, messageMedia, options);
    return;
  } catch (error) {
    console.log("🚀 ~ file: whatsapp.js:58 ~ sendMediaWhatsapp ~ error:", error);
  }
};
module.exports = { sendMessage, sendMediaWhatsapp };
