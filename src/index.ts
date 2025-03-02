import TelegramBot from "node-telegram-bot-api";
import { getPage } from "./shadowmere";

// TODO: my notes on telegram
// read bout difference between polling and webhook
// events
// message
// message -> text
// message -> audio
// message -> photo
// message -> voice
// message -> video
// message -> sticker

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN || "", {
  polling: {
    interval: 500,
    autoStart: true,
  },
});

bot.on("polling_error", (err) => {
  console.log("Polling error");
  console.log(err);
});

const cb = (name: string) => (_msg: any, _md: any) =>
  console.log(`We got "${name}"`);

bot.on("text", cb("text"));
bot.on("audio", cb("audio"));
bot.on("photo", cb("photo"));
bot.on("voice", cb("voice"));
bot.on("video", cb("video"));
bot.on("sticker", cb("sticker"));

bot.onText(/^\/getproxy$/i, async (msg) => {
  const cid = msg.chat.id;
  const fmsg = bot.sendMessage(cid, "Fetching api...");

  try {
    const page1 = await getPage(1);

    bot.editMessageText(
      "Data from " +
      new URL(process.env.API_URL || "").hostname +
      page1.results.reduce(
        (prev, cur) => `${prev}\n\`${cur.url}#${cur.location}\``,
        "\n",
      ),
      {
        chat_id: cid,
        message_id: (await fmsg).message_id,
        parse_mode: "Markdown",
      },
    );
  } catch {
    bot.editMessageText("Unable to reach api. Try again later.", {
      chat_id: cid,
      message_id: (await fmsg).message_id,
    });
  }
});

bot.setMyCommands([
  {
    command: "getproxy",
    description: "Gives SS keys",
  },
]);
