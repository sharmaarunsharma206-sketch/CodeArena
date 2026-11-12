package com.codearena.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "problem_id", nullable = false, length = 64)
    private String problemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id")
    private Contest contest;

    @Column(nullable = false, length = 32)
    private String language;

    @Column(name = "source_code", nullable = false, columnDefinition = "TEXT")
    private String sourceCode;

    @Column(nullable = false, length = 64)
    private String verdict; // Accepted, Wrong Answer, Time Limit Exceeded, Runtime Error

    @Column(name = "execution_time", nullable = false, length = 32)
    private String executionTime;

    @Column(name = "memory_used", nullable = false, length = 32)
    private String memoryUsed;

    @Column(name = "test_cases_passed", nullable = false)
    @Builder.Default
    private int testCasesPassed = 0;

    @Column(name = "test_cases_total", nullable = false)
    @Builder.Default
    private int testCasesTotal = 0;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant submittedAt = Instant.now();
}
