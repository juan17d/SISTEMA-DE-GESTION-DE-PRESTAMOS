package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Libro;
import com.biblioteca.biblioteca.repository.LibroRepository;
import com.biblioteca.biblioteca.service.LibroService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LibroServiceImpl implements LibroService {

    private final LibroRepository libroRepository;

    public LibroServiceImpl(LibroRepository libroRepository) {
        this.libroRepository = libroRepository;
    }

    @Override
    public Libro crear(@NonNull Libro libro) { return libroRepository.save(libro); }

    @Override
    public Libro obtenerPorId(@NonNull Long id) {
        return libroRepository.findById(id).orElse(null);
    }

    @Override
    public List<Libro> listar() { return libroRepository.findAll(); }

    @Override
    public Libro actualizar(@NonNull Long id, @NonNull Libro libro) {
        libroRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado"));
        libro.setId(id);
        return libroRepository.save(libro);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        libroRepository.deleteById(id);
    }
}
