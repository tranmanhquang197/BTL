package com.tsolution._2repositories;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.tsolution._1entities.Generator;

public interface GeneratorRepository extends JpaRepository<Generator, Long>, JpaSpecificationExecutor<Generator> {
	Optional<Generator> findOneByCode(String code);

	@Query(value = "SELECT SYSDATE()", nativeQuery = true)
	LocalDateTime getSysdate();
}