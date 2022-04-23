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

async function getSubmissionDifficulties(submissions) {
  if (submissions.length == 0) { return submissions; }

  const difficultyQuery = '{' + submissions.map(s => difficultyFragment(s)).join("") + '}'
  const difficultyMap = await request(LEETCODE_API, difficultyQuery);
  return submissions.map(s => ({ ...s, ...difficultyMap[snakeize(s.titleSlug)] }));
}

export async function getSubmissionsToday() {
  const response = await request(LEETCODE_API, recentSubmissionsQuery, { username: 'hermanwongkmwork' });

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const startTimestamp = startOfDay.getTime() / 1000
  const submissions = response.recentAcSubmissionList
    // .filter((submission => submission.timestamp >= startTimestamp));
  return getSubmissionDifficulties(submissions);
}

function snakeize(identifier) {
  return identifier.replaceAll('-', '_')
}
