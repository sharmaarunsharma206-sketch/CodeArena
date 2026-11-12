package com.codearena.repository;

import com.codearena.entity.DailyProblemUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DailyProblemUsageRepository extends JpaRepository<DailyProblemUsage, String> {

    List<DailyProblemUsage> findByUserIdAndActivityDate(String userId, String activityDate);

    Optional<DailyProblemUsage> findByUserIdAndProblemIdAndActivityDate(String userId, String problemId, String activityDate);

    @Query("SELECT COUNT(DISTINCT d.problemId) FROM DailyProblemUsage d WHERE d.user.id = :userId AND d.activityDate = :activityDate")
    long countDistinctProblemsAccessed(@Param("userId") String userId, @Param("activityDate") String activityDate);

    @Query("SELECT DISTINCT d.problemId FROM DailyProblemUsage d WHERE d.user.id = :userId AND d.activityDate = :activityDate")
    List<String> findDistinctProblemIdsAccessed(@Param("userId") String userId, @Param("activityDate") String activityDate);
}
