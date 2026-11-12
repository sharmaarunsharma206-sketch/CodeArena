package com.codearena.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "daily_problem_usage", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_problem_date", columnNames = {"user_id", "problem_id", "activity_date"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyProblemUsage {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "problem_id", nullable = false, length = 64)
    private String problemId;

    @Column(name = "activity_date", nullable = false, length = 10)
    private String activityDate; // YYYY-MM-DD in Asia/Kolkata

    @Column(name = "first_accessed_at", nullable = false)
    @Builder.Default
    private Instant firstAccessedAt = Instant.now();
}
