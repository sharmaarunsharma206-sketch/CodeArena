package com.codearena.repository;

import com.codearena.entity.ContestParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContestParticipantRepository extends JpaRepository<ContestParticipant, String> {
    Optional<ContestParticipant> findByContestIdAndUserId(String contestId, String userId);
    List<ContestParticipant> findByContestIdOrderByScoreDescPenaltyMinutesAscRegisteredAtAsc(String contestId);
    long countByContestId(String contestId);
    boolean existsByContestIdAndUserId(String contestId, String userId);
}
