package com.codearena.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "contests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contest {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true, length = 64)
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(nullable = false, length = 64)
    @Builder.Default
    private String timezone = "Asia/Kolkata";

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String status = "UPCOMING"; // UPCOMING, LIVE, COMPLETED

    @Column(name = "problem_ids", nullable = false, columnDefinition = "TEXT")
    private String problemIds;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
