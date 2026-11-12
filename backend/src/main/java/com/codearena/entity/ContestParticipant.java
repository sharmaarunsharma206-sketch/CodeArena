package com.codearena.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "contest_participants", uniqueConstraints = {
    @UniqueConstraint(name = "uq_contest_participant", columnNames = {"contest_id", "user_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContestParticipant {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contest_id", nullable = false)
    private Contest contest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "registered_at", nullable = false)
    @Builder.Default
    private Instant registeredAt = Instant.now();

    @Column(nullable = false)
    @Builder.Default
    private int score = 0;

    @Column(name = "penalty_minutes", nullable = false)
    @Builder.Default
    private int penaltyMinutes = 0;
}
