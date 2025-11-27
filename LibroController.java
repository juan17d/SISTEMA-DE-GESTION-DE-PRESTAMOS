package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.dto.LibroDTO;
import com.biblioteca.biblioteca.entity.Libro;
import com.biblioteca.biblioteca.service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/libros")
@CrossOrigin(origins = "*")
public class LibroController {

    @Autowired
    private LibroService libroService;

    @GetMapping
    public List<LibroDTO> list() {
        return libroService.listar().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public LibroDTO getById(@PathVariable @NonNull Long id) {
        Libro libro = libroService.obtenerPorId(id);
        return libro != null ? convertToDTO(libro) : null;
    }

    @PostMapping
    public LibroDTO create(@RequestBody @NonNull Libro libro) {
        Libro creado = libroService.crear(libro);
        return convertToDTO(creado);
    }

    @PutMapping("/{id}")
    public LibroDTO update(@PathVariable @NonNull Long id, @RequestBody @NonNull Libro libro) {
        Libro actualizado = libroService.actualizar(id, libro);
        return convertToDTO(actualizado);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        libroService.eliminar(id);
    }

    private LibroDTO convertToDTO(Libro libro) {
        // Convertir autores
        List<LibroDTO.AutorDTO> autoresDTO = null;
        if (libro.getAutores() != null) {
            autoresDTO = libro.getAutores().stream()
                .map(autor -> new LibroDTO.AutorDTO(autor.getId(), autor.getNombre()))
                .collect(Collectors.toList());
        }

        // Convertir editorial
        LibroDTO.EditorialDTO editorialDTO = null;
        if (libro.getEditorial() != null) {
            editorialDTO = new LibroDTO.EditorialDTO(
                libro.getEditorial().getId(),
                libro.getEditorial().getNombre()
            );
        }

        // Convertir género
        LibroDTO.GeneroDTO generoDTO = null;
        if (libro.getGenero() != null) {
            generoDTO = new LibroDTO.GeneroDTO(
                libro.getGenero().getId(),
                libro.getGenero().getNombre()
            );
        }

        // Calcular stock disponible (ejemplares disponibles)
        int stockDisponible = 0;
        if (libro.getEjemplares() != null) {
            stockDisponible = (int) libro.getEjemplares().stream()
                .filter(ejemplar -> ejemplar.getDisponible() != null && ejemplar.getDisponible())
                .count();
        }

        return new LibroDTO(
            libro.getId(),
            libro.getTitulo(),
            autoresDTO,
            editorialDTO,
            generoDTO,
            stockDisponible
        );
    }
}

