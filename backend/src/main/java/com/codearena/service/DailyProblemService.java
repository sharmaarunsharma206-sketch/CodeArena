package com.codearena.service;

import com.codearena.entity.DailyProblemUsage;
import com.codearena.entity.User;
import com.codearena.repository.DailyProblemUsageRepository;
import com.codearena.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class DailyProblemService {

    private final DailyProblemUsageRepository dailyUsageRepository;
    private final UserRepository userRepository;

    private static final ZoneId IST_ZONE = ZoneId.of("Asia/Kolkata");
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final int MAX_DAILY_DISTINCT_PROBLEMS = 2;

    // Concurrency lock per user to serialize concurrent problem access requests
    private final ConcurrentHashMap<String, Object> userLocks = new ConcurrentHashMap<>();

    public String getTodayISTDate() {
        return DATE_FORMATTER.format(Instant.now().atZone(IST_ZONE));
    }

    public static class DailyUsageStatus {
        private final String todayDateIST;
        private final int usedCount;
        private final int maxDailyLimit;
        private final int remaining;
        private final List<String> accessedProblemIds;
        private final boolean allowed;
        private final String message;

        public DailyUsageStatus(String todayDateIST, int usedCount, int maxDailyLimit, int remaining, List<String> accessedProblemIds, boolean allowed, String message) {
            this.todayDateIST = todayDateIST;
            this.usedCount = usedCount;
            this.maxDailyLimit = maxDailyLimit;
            this.remaining = remaining;
            this.accessedProblemIds = accessedProblemIds;
            this.allowed = allowed;
            this.message = message;
        }

        public String getTodayDateIST() { return todayDateIST; }
        public int getUsedCount() { return usedCount; }
        public int getMaxDailyLimit() { return maxDailyLimit; }
        public int getRemaining() { return remaining; }
        public List<String> getAccessedProblemIds() { return accessedProblemIds; }
        public boolean isAllowed() { return allowed; }
        public String getMessage() { return message; }
    }

    @Transactional(readOnly = true)
    public DailyUsageStatus getUsage(String userId) {
        String today = getTodayISTDate();
        List<String> distinctProblems = dailyUsageRepository.findDistinctProblemIdsAccessed(userId, today);
        int used = distinctProblems.size();
        int remaining = Math.max(0, MAX_DAILY_DISTINCT_PROBLEMS - used);

        return new DailyUsageStatus(
                today,
                used,
                MAX_DAILY_DISTINCT_PROBLEMS,
                remaining,
                distinctProblems,
                true,
                String.format("Daily Problem Limit: %d / %d", used, MAX_DAILY_DISTINCT_PROBLEMS)
        );
    }

    /**
     * Checks and registers access to a problem with transaction isolation and mutex concurrency protection.
     * Enforces the strict 2 distinct problem limit per calendar day in Asia/Kolkata.
     */
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public DailyUsageStatus accessProblem(String userId, String problemId) {
        Object lock = userLocks.computeIfAbsent(userId, k -> new Object());
        synchronized (lock) {
            String today = getTodayISTDate();
            List<String> distinctProblems = dailyUsageRepository.findDistinctProblemIdsAccessed(userId, today);

            // If already accessed today, permit unlimited access/submissions without consuming allowance
            if (distinctProblems.contains(problemId)) {
                return new DailyUsageStatus(
                        today,
                        distinctProblems.size(),
                        MAX_DAILY_DISTINCT_PROBLEMS,
                        MAX_DAILY_DISTINCT_PROBLEMS - distinctProblems.size(),
                        distinctProblems,
                        true,
                        "Problem is already active in your daily allowance. Free to practice and submit."
                );
            }

            // If user already reached 2 distinct problems, strictly reject
            if (distinctProblems.size() >= MAX_DAILY_DISTINCT_PROBLEMS) {
                return new DailyUsageStatus(
                        today,
                        distinctProblems.size(),
                        MAX_DAILY_DISTINCT_PROBLEMS,
                        0,
                        distinctProblems,
                        false,
                        "You have completed your two-problem daily allowance. Come back tomorrow to solve more challenges."
                );
            }

            // Register new access
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

            DailyProblemUsage usage = DailyProblemUsage.builder()
                    .id("usage_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 6))
                    .user(user)
                    .problemId(problemId)
                    .activityDate(today)
                    .firstAccessedAt(Instant.now())
                    .build();

            dailyUsageRepository.save(usage);
            distinctProblems.add(problemId);

            int newCount = distinctProblems.size();
            int remaining = MAX_DAILY_DISTINCT_PROBLEMS - newCount;

            return new DailyUsageStatus(
                    today,
                    newCount,
                    MAX_DAILY_DISTINCT_PROBLEMS,
                    remaining,
                    distinctProblems,
                    true,
                    String.format("Problem registered for today. Allowance remaining: %d / %d.", remaining, MAX_DAILY_DISTINCT_PROBLEMS)
            );
        }
    }
}
