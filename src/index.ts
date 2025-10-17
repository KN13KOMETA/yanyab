import TelegramBot from "node-telegram-bot-api";
import { connect } from "puppeteer-real-browser";
import { ShadowmereProvider } from "./ShadowmereProvider";

// TODO: i18n, universal io, uio commands
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

let smProvider: ShadowmereProvider | null = null;
(async () => {
  const { page, browser } = await connect({
    headless: false,
    args: [],
    customConfig: {},
    turnstile: true,
    connectOption: {},
    disableXvfb: false,
    ignoreAllFlags: false,
  });

  smProvider = new ShadowmereProvider(process.env.SM_URL || "", page);
  await smProvider.init();

  // browser.close();
})();

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN || "", {
  polling: {
    interval: 1000,
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

  if (!smProvider) {
    bot.editMessageText("Bot is starting. Try again later.", {
      chat_id: cid,
      message_id: (await fmsg).message_id,
    });

    return;
  }

  try {
    const page1 = await smProvider.getPage(1);
    // const page1 = await getPage(1);

    console.log(page1);

    bot.editMessageText(
      "Data from " +
      new URL(process.env.SM_URL || "").hostname +
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
