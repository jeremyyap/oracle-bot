import { request, gql } from 'graphql-request';

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

const difficultyQuery = gql`
  query getQuestionDetail($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      difficulty
    }
  }
`;

export async function getSubmissionsToday() {
  const variables = { username: 'hermanwongkmwork' };
  const response = await request('https:/leetcode.com/graphql', recentSubmissionsQuery, variables);

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);
  const startTimestamp = startOfDay.getTime() / 1000
  return response.recentAcSubmissionList
    .filter((submission => submission.timestamp >= startTimestamp));
}
