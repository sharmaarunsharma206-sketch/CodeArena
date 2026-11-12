package com.codearena.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "google_subject_id", nullable = false, unique = true)
    private String googleSubjectId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false, unique = true, length = 64)
    private String username;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private boolean emailVerified = true;

    @Column(nullable = false, length = 32)
    @Builder.Default
    private String role = "ROLE_USER";

    @Column(nullable = false)
    @Builder.Default
    private int points = 0;

    @Column(name = "account_status", nullable = false, length = 32)
    @Builder.Default
    private String accountStatus = "ACTIVE";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
}
