package com.codearena.repository;

import com.codearena.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, String> {
    List<Submission> findByUserIdOrderBySubmittedAtDesc(String userId);
    List<Submission> findByUserIdAndProblemId(String userId, String problemId);
    List<Submission> findByContestIdOrderBySubmittedAtDesc(String contestId);

    @Query("SELECT COUNT(DISTINCT s.problemId) FROM Submission s WHERE s.user.id = :userId AND s.verdict = 'Accepted'")
    long countSolvedDistinctProblemsByUser(@Param("userId") String userId);

    @Query("SELECT DISTINCT s.problemId FROM Submission s WHERE s.user.id = :userId AND s.verdict = 'Accepted'")
    List<String> findSolvedProblemIdsByUser(@Param("userId") String userId);

    @Query("SELECT COUNT(DISTINCT s.problemId) FROM Submission s WHERE s.verdict = 'Accepted'")
    long countGlobalDistinctProblemsSolved();
}
