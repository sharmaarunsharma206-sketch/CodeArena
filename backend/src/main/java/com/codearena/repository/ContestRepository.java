package com.codearena.repository;

import com.codearena.entity.Contest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContestRepository extends JpaRepository<Contest, String> {
    Optional<Contest> findByCode(String code);
    List<Contest> findByStatusOrderByStartTimeAsc(String status);
}
