import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { translateText } from './translate.js';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.command('herman', ctx => {
  ctx.reply("Herman stop slacking!");
});

bot.command('translate', async ctx => {
  const text = ctx.message.text
  const inputText = text.slice(text.indexOf(' ') + 1);
  if (inputText.length > 0) {
    const translation = await translateText(inputText);
    ctx.reply(translation);
  }
})

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    await bot.handleUpdate(body);
  } catch (err) {
    console.error(err);
  }
}
