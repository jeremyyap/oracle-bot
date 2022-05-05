import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { getSubmissionsLast24Hours, getQuestionDifficulties } from './leetcode.js';

dotenv.config();

const usernames = [
  'hermanwongkmwork',
  'jeremyyap',
  'saiful_shahril',
  'sturdek'
];

const displayNames = {
  hermanwongkmwork: 'Herman',
  jeremyyap: 'Jeremy',
  saiful_shahril: 'Saiful',
  sturdek: 'KC'
};

const problemURL = (titleSlug) => `https://leetcode.com/problems/${titleSlug}`;
const difficulty = (problem) => {
  switch(problem.difficulty) {
    case 'Easy': return '\u{1F7E9}';
    case 'Medium': return '\u{1F7E8}';
    case 'Hard': return '\u{1F7E5}';
    default: return '\u{2B1C}';
  }
}
const formatSubmission = (s) => `[${difficulty(s)}](${problemURL(s.titleSlug)})`;

export async function handler(event) {
  try {
    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

    const usersSubmissions = await getSubmissionsLast24Hours(usernames);
    let message = "No submission data found\\. Either everyone is slacking or LeetCode API is down again\\.";

    const allSubmissions = Object.values(usersSubmissions).flat();
    if (allSubmissions.length > 0) {
      await getQuestionDifficulties(allSubmissions);

      message = '*LeetCode Submissions Today*\n\n' + usernames.map((username) => {
        const submissions = usersSubmissions[username];
        return `${displayNames[username]}\n${submissions.map(s => formatSubmission(s)).join("")}\n`;
      }).join('\n');
    }
    await bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'MarkdownV2', disable_web_page_preview: true });
  } catch (err) {
    console.error(err);
  }
}
