package com.biblioteca.biblioteca.repository;

import com.biblioteca.biblioteca.entity.Ejemplar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EjemplarRepository extends JpaRepository<Ejemplar, Long> {
}
