import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.command('leetcode', ctx => {
  ctx.reply("Herman stop slacking");
});

bot.telegram.setWebhook("https://740a-116-14-211-46.ngrok.io");
bot.startWebhook('/', null, 5000);
