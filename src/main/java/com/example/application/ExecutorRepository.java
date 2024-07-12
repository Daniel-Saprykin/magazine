package com.example.application;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ExecutorRepository extends JpaRepository<Executor, Long> {
    Optional<Executor> findByName(String name);
}
