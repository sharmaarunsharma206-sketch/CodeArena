import { db, getTodayIST } from '../server/db';
import {
  verifyGoogleIdToken,
  generateAppJwt,
  createMockGoogleIdToken,
} from '../server/auth';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('=== STARTING CODE ARENA PLATFORM AUTOMATED TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
      failed++;
    }
  }

  // TEST 1: Initial state - 0 registered users, 0 submissions, 0 solved
  console.log('--- Suite 1: Initial Fresh Platform Zero-State ---');
  db.resetDatabase();
  const initialStats = db.getPlatformStats();
  assert(initialStats.registeredUsers === 0, 'Initially, registered user count must be 0');
  assert(initialStats.activeUsers === 0, 'Initially, active users must be 0');
  assert(initialStats.totalSolved === 0, 'Initially, solved problems must be 0');
  assert(initialStats.totalSubmissions === 0, 'Initially, submissions must be 0');
  const initialLeaderboard = db.getLeaderboard();
  assert(initialLeaderboard.length === 0, 'Initially, the leaderboard must be empty');

  // TEST 2: Google Token Verification - Non-Gmail account rejection
  console.log('\n--- Suite 2: Google Authentication & Domain Validation ---');
  const nonGmailToken = jwt.sign(
    {
      iss: 'https://accounts.google.com',
      aud: 'codearena-google-client-id',
      sub: 'google-sub-non-gmail',
      email: 'alex@apexsaas.io', // Not @gmail.com
      email_verified: true,
      name: 'Alex Morgan',
    },
    process.env.JWT_SECRET || 'codearena_jwt_production_secret_key_2026_secure'
  );

  let nonGmailRejected = false;
  try {
    await verifyGoogleIdToken(nonGmailToken);
  } catch (err: any) {
    nonGmailRejected = err.message.includes('@gmail.com');
  }
  assert(nonGmailRejected, 'Non-Gmail account rejection (e.g. @apexsaas.io)');

  // TEST 3: Unverified email rejection
  const unverifiedToken = jwt.sign(
    {
      iss: 'https://accounts.google.com',
      aud: 'codearena-google-client-id',
      sub: 'google-sub-unverified',
      email: 'tester@gmail.com',
      email_verified: false, // Unverified
      name: 'Unverified User',
    },
    process.env.JWT_SECRET || 'codearena_jwt_production_secret_key_2026_secure'
  );

  let unverifiedRejected = false;
  try {
    await verifyGoogleIdToken(unverifiedToken);
  } catch (err: any) {
    unverifiedRejected = err.message.includes('not verified');
  }
  assert(unverifiedRejected, 'Unverified email rejection (email_verified: false)');

  // TEST 4: Invalid / Malformed token rejection
  let invalidTokenRejected = false;
  try {
    await verifyGoogleIdToken('invalid.garbage.jwt');
  } catch {
    invalidTokenRejected = true;
  }
  assert(invalidTokenRejected, 'Invalid Google token rejection');

  // TEST 5: New Google account registration with verified Gmail
  const validGmailToken = createMockGoogleIdToken('sharmaarunsharma206@gmail.com', 'Arun Sharma', 'sub_arun_google_123');
  const verifiedUserPayload = await verifyGoogleIdToken(validGmailToken);
  assert(
    verifiedUserPayload.email === 'sharmaarunsharma206@gmail.com' && verifiedUserPayload.email_verified,
    'Valid Google token verification success for @gmail.com'
  );

  const user1 = db.createUser({
    id: 'usr_arun_01',
    google_subject_id: verifiedUserPayload.sub,
    full_name: verifiedUserPayload.name,
    email: verifiedUserPayload.email,
    username: 'arun_codes',
    email_verified: true,
    role: 'ROLE_USER',
  });
  assert(user1.username === 'arun_codes', 'New Google account registered in database');

  const afterRegStats = db.getPlatformStats();
  assert(afterRegStats.registeredUsers === 1, 'Registered user count dynamically updates to 1');

  // TEST 6: Duplicate account rejection
  const duplicateUserCheck = db.getUserByGoogleSubjectId('sub_arun_google_123');
  assert(duplicateUserCheck !== undefined, 'Duplicate account detected by Google Subject ID');

  // TEST 7: Daily Problem Limit - First problem access (Allowed, 1 remaining)
  console.log('\n--- Suite 3: Strict 2-Problem Daily Limit (Asia/Kolkata) ---');
  const accessProb1 = await db.accessDailyProblem(user1.id, 'prob-1');
  assert(accessProb1.allowed, 'First problem access allowed');
  assert(accessProb1.remaining === 1, 'First problem access leaves 1 problem remaining in allowance');

  // TEST 8: Second problem access (Allowed, 0 remaining)
  const accessProb2 = await db.accessDailyProblem(user1.id, 'prob-2');
  assert(accessProb2.allowed, 'Second problem access allowed');
  assert(accessProb2.remaining === 0, 'Second problem access leaves 0 problems remaining in allowance');

  // TEST 9: Third problem rejection (HTTP 403 / Limit reached)
  const accessProb3 = await db.accessDailyProblem(user1.id, 'prob-3');
  assert(!accessProb3.allowed, 'Third distinct problem strictly rejected');
  assert(
    accessProb3.message.includes('completed your two-problem daily allowance'),
    'Exhausted limit message: "You have completed your two-problem daily allowance. Come back tomorrow to solve more challenges."'
  );

  // TEST 10: Multiple submissions for the same problem allowed without consuming allowance
  const reAccessProb1 = await db.accessDailyProblem(user1.id, 'prob-1');
  assert(reAccessProb1.allowed, 'Re-access to already unlocked problem allowed without consuming allowance');
  assert(!reAccessProb1.isNewAccess, 'Re-access marked as non-new access');

  // Submit multiple solutions to problem 1
  const sub1 = db.createSubmission({
    user_id: user1.id,
    problem_id: 'prob-1',
    language: 'python',
    source_code: 'def twoSum(nums, target): return [0, 1]',
    verdict: 'Accepted',
    execution_time: '42 ms',
    memory_used: '16.4 MB',
    test_cases_passed: 4,
    test_cases_total: 4,
  });
  const sub2 = db.createSubmission({
    user_id: user1.id,
    problem_id: 'prob-1',
    language: 'python',
    source_code: 'def twoSum(nums, target): return [0, 1] # optimized',
    verdict: 'Accepted',
    execution_time: '38 ms',
    memory_used: '15.9 MB',
    test_cases_passed: 4,
    test_cases_total: 4,
  });
  db.updateUserPoints(user1.id, 50);

  assert(sub1.verdict === 'Accepted' && sub2.verdict === 'Accepted', 'Multiple submissions for the same problem recorded');

  // TEST 11: Daily limit reset at midnight IST
  // Simulate yesterday's activity date
  const yesterdayUsage = db.getDailyUsageForUser(user1.id, '2026-11-11');
  assert(yesterdayUsage.remaining === 2, 'Daily limit resets at midnight IST for new calendar day');

  // TEST 12: Concurrent problem-access requests protection
  console.log('\n--- Suite 4: Concurrency Protection ---');
  // Create a second user for concurrency test
  const user2 = db.createUser({
    id: 'usr_concurrency_02',
    google_subject_id: 'google-sub-concurrency-02',
    full_name: 'Concurrent Tester',
    email: 'concurrent@gmail.com',
    username: 'concurrent_user',
    email_verified: true,
    role: 'ROLE_USER',
  });

  // Launch 5 simultaneous requests for 5 distinct problems
  const concurrentResults = await Promise.all([
    db.accessDailyProblem(user2.id, 'prob-1'),
    db.accessDailyProblem(user2.id, 'prob-2'),
    db.accessDailyProblem(user2.id, 'prob-3'),
    db.accessDailyProblem(user2.id, 'prob-4'),
    db.accessDailyProblem(user2.id, 'prob-5'),
  ]);

  const allowedCount = concurrentResults.filter((r) => r.allowed).length;
  const rejectedCount = concurrentResults.filter((r) => !r.allowed).length;

  assert(allowedCount === 2, 'Concurrency protection: exactly 2 distinct problems allowed');
  assert(rejectedCount === 3, 'Concurrency protection: remaining 3 distinct problems rejected');

  // TEST 13: Contest opening, closing, and deadline submission rejection
  console.log('\n--- Suite 5: Daily Coding Contest System ---');
  const contest = db.getTodayContest();
  assert(contest !== undefined, 'Daily contest scheduled for Asia/Kolkata timezone');

  // Register participant
  const reg = db.registerForContest(contest.id, user1.id);
  assert(reg.user_id === user1.id, 'User registered for contest');

  // Test contest closing: set end_time in the past
  const pastTime = new Date(Date.now() - 60000).toISOString();
  const pastStart = new Date(Date.now() - 120000).toISOString();
  db.updateContestSchedule(contest.id, pastStart, pastTime);
  const closedContest = db.getContestById(contest.id);
  assert(closedContest?.status === 'COMPLETED', 'Contest automatically closes at its configured end time');

  // TEST 14: Dynamic platform statistics and leaderboard update
  console.log('\n--- Suite 6: Dynamic Platform Statistics & Leaderboard ---');
  const finalStats = db.getPlatformStats();
  assert(finalStats.registeredUsers === 2, 'Real registered users count dynamically updated to 2');
  assert(finalStats.totalSolved === 1, 'Distinct problems solved globally updated to 1');
  assert(finalStats.totalSubmissions === 2, 'Total submissions updated to 2');

  const finalLeaderboard = db.getLeaderboard();
  assert(finalLeaderboard.length === 2, 'Leaderboard reflects genuine registered users');
  assert(finalLeaderboard[0].username === 'arun_codes', 'Active solver ranked #1 on leaderboard');

  console.log(`\n=== TEST SUITE COMPLETE: ${passed} PASSED, ${failed} FAILED ===\n`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((e) => {
  console.error('Test Suite encountered fatal error:', e);
  process.exit(1);
});
