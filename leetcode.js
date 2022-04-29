import { request, gql } from 'graphql-request';

const LEETCODE_API = 'https:/leetcode.com/graphql';

const problemsSolvedQuery = gql`
  query userProblemsSolved($username: String!) {
    matchedUser(username: $username) {
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
    }
  }
`;

const recentSubmissionsQuery = gql`
  query recentAcSubmissions($username: String!) {
    recentAcSubmissionList(username: $username, limit: 10) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const difficultyFragment = (submission) => gql`
  ${snakeize(submission.titleSlug)}: question(titleSlug: "${submission.titleSlug}") {
    difficulty
  }
`;

export async function getSubmissionDifficulties(submissions) {
  if (submissions.length == 0) { return submissions; }

  const difficultyQuery = '{' + submissions.map(s => difficultyFragment(s)).join("") + '}'
  const difficultyMap = await request(LEETCODE_API, difficultyQuery);
  submissions.forEach(s => s.difficulty = difficultyMap[snakeize(s.titleSlug)].difficulty);
}

export async function getSubmissionsLast24Hours(username) {
  const response = await request(LEETCODE_API, recentSubmissionsQuery, { username });

  const startTime = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  const startTimestamp = startTime.getTime() / 1000
  return response.recentAcSubmissionList
    .filter((submission => submission.timestamp >= startTimestamp));
}

function snakeize(identifier) {
  return identifier.replace(/-/g, '_');
}
