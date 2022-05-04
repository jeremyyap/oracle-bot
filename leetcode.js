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

const submissionsFragment = (username) => gql`
  ${username}: recentAcSubmissionList(username: "${username}", limit: 20) {
    id
    title
    titleSlug
    timestamp
  }
`;

const difficultyFragment = (titleSlug) => gql`
  ${snakeize(titleSlug)}: question(titleSlug: "${titleSlug}") {
    difficulty
  }
`;

export async function getQuestionDifficulties(submissions) {
  if (submissions.length == 0) { return; }

  const titleSlugs = submissions.map(s => s.titleSlug);
  const uniqueSlugs = [...new Set(titleSlugs)];
  const difficultyQuery = '{' + uniqueSlugs.map(s => difficultyFragment(s)).join("") + '}';
  const difficultyMap = await request(LEETCODE_API, difficultyQuery, {});

  submissions.forEach(s => s.difficulty = difficultyMap[snakeize(s.titleSlug)].difficulty);
}

export async function getSubmissionsLast24Hours(usernames) {
  const recentSubmissionsQuery = '{' + usernames.map(u => submissionsFragment(u)).join("") + '}';
  const response = await request(LEETCODE_API, recentSubmissionsQuery);

  const startTime = new Date(new Date().getTime() - (24 * 60 * 60 * 1000));
  const startTimestamp = startTime.getTime() / 1000
  return Object.fromEntries(
    Object.entries(response).map(
      ([k, submissions]) => [k, submissions.filter(s => s.timestamp >= startTimestamp)]
    )
  );
}

function snakeize(identifier) {
  return '_' + identifier.replace(/-/g, '_');
}
