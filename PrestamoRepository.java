package com.biblioteca.biblioteca.repository;

import com.biblioteca.biblioteca.entity.Prestamo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PrestamoRepository extends JpaRepository<Prestamo, Long> {

    // Buscar préstamos NO devueltos cuya fecha de devolución ya pasó
    List<Prestamo> findByDevueltoFalseAndFechaDevolucionBefore(LocalDate fecha);
}
