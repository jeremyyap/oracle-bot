import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command('herman', ctx => {
  ctx.reply("Herman stop slacking!");
});

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    await bot.handleUpdate(body);
  } catch (err) {
    console.error(err);
  }
}
