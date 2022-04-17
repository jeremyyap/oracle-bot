require('dotenv').config();
const { request, gql } = require('graphql-request');
const { Telegraf } = require('telegraf');

const query = gql`
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const variables = {
  username: 'hermanwongkmwork',
  limit: 10
};

const problemURL = (titleSlug) => `https://leetcode.com/problems/${titleSlug}`;
const formatProblem = (problem) => `[${problem.title}](${problemURL(problem.titleSlug)})`

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

request('https:/leetcode.com/graphql', query, variables).then((data) => {
  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const startTimestamp = startOfDay.getTime() / 1000
  const todayProblems = data.recentAcSubmissionList
    .filter((submission => submission.timestamp >= startTimestamp));

  const message = todayProblems.length > 0 ? `Herman has solved ${todayProblems.length} problem${todayProblems.length == 1 ? '' : 's'} today:\n\n` +
    todayProblems.map(p => formatProblem(p)).join('\n') :
    `Herman has solved 0 LeetCode problems today. Stop slacking Herman!`;

  bot.telegram.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'MarkdownV2', disable_web_page_preview: true });
})
