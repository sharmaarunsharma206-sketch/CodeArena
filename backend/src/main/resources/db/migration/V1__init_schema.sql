-- ==============================================================================
-- Code Arena PostgreSQL Database Schema Migration V1
-- ==============================================================================

-- 1. Users Table (Real Google Verified Accounts)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    google_subject_id VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(64) NOT NULL UNIQUE,
    profile_picture TEXT,
    email_verified BOOLEAN NOT NULL DEFAULT TRUE,
    role VARCHAR(32) NOT NULL DEFAULT 'ROLE_USER',
    points INTEGER NOT NULL DEFAULT 0,
    account_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_google_sub ON users(google_subject_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- 2. Daily Problem Usage (2-Problem Daily Limit, Asia/Kolkata Midnight Reset)
CREATE TABLE IF NOT EXISTS daily_problem_usage (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) NOT NULL,
    activity_date VARCHAR(10) NOT NULL, -- YYYY-MM-DD in Asia/Kolkata
    first_accessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_problem_date UNIQUE (user_id, problem_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON daily_problem_usage(user_id, activity_date);

-- 3. Contests Table (Asia/Kolkata Daily Competitions)
CREATE TABLE IF NOT EXISTS contests (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    code VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Kolkata',
    status VARCHAR(32) NOT NULL DEFAULT 'UPCOMING', -- UPCOMING, LIVE, COMPLETED
    problem_ids TEXT NOT NULL, -- Comma-separated or JSON array of problem IDs
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contests_status ON contests(status);
CREATE INDEX IF NOT EXISTS idx_contests_time ON contests(start_time, end_time);

-- 4. Contest Participants Table
CREATE TABLE IF NOT EXISTS contest_participants (
    id VARCHAR(64) PRIMARY KEY,
    contest_id VARCHAR(64) NOT NULL REFERENCES contests(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    score INTEGER NOT NULL DEFAULT 0,
    penalty_minutes INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT uq_contest_participant UNIQUE (contest_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_contest_part_contest ON contest_participants(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_part_user ON contest_participants(user_id);

-- 5. Submissions Table (Sandboxed Evaluations & Real Records)
CREATE TABLE IF NOT EXISTS submissions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id VARCHAR(64) NOT NULL,
    contest_id VARCHAR(64) REFERENCES contests(id) ON DELETE SET NULL,
    language VARCHAR(32) NOT NULL,
    source_code TEXT NOT NULL,
    verdict VARCHAR(64) NOT NULL, -- Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error
    execution_time VARCHAR(32) NOT NULL,
    memory_used VARCHAR(32) NOT NULL,
    test_cases_passed INTEGER NOT NULL DEFAULT 0,
    test_cases_total INTEGER NOT NULL DEFAULT 0,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_contest ON submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at);
