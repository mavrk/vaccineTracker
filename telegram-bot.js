const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = String(process.env.TOKEN);
// read the doc from https://github.com/yagop/node-telegram-bot-api to know how to catch the chatId
const chatId = String(process.env.CHATID);

const bot = new TelegramBot(token, { polling: false });

exports.telegrambot = (msg) => {
  try {
    bot.sendMessage(chatId,msg, {
      parse_mode: 'html'
    });
  } catch (err) {
    console.log('Something went wrong when trying to send a Telegram notification', err);
  }
}