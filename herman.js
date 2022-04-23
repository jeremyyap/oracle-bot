import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';
import { getSubmissionsToday } from './leetcode.js';

dotenv.config();

const usernames = [
  'hermanwongkmwork',
  'jeremyyap',
  'saiful_shahril',
  'sturdek'
];

const variables = {
  username: 'hermanwongkmwork'
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
const formatProblem = (problem) => `${difficulty(problem)} [${problem.title}](${problemURL(problem.titleSlug)})`;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

getSubmissionsToday().then(todayProblems => {
  const message = todayProblems.length > 0 ? `Herman stop slacking\\! You ONLY solved ${todayProblems.length} problem${todayProblems.length == 1 ? '' : 's'} today:\n\n` +
    todayProblems.map(p => formatProblem(p)).join('\n') :
    `Herman has solved 0 LeetCode problems today\\. Stop slacking Herman\\!`;
  bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'MarkdownV2', disable_web_page_preview: true });
});
