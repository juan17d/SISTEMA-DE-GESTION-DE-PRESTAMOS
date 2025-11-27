package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Genero;
import com.biblioteca.biblioteca.repository.GeneroRepository;
import com.biblioteca.biblioteca.service.GeneroService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeneroServiceImpl implements GeneroService {

    private final GeneroRepository generoRepository;

    public GeneroServiceImpl(GeneroRepository generoRepository) {
        this.generoRepository = generoRepository;
    }

    @Override
    public Genero crear(@NonNull Genero genero) { return generoRepository.save(genero); }

    @Override
    public Genero obtenerPorId(@NonNull Long id) {
        return generoRepository.findById(id).orElse(null);
    }

    @Override
    public List<Genero> listar() { return generoRepository.findAll(); }

    @Override
    public Genero actualizar(@NonNull Long id, @NonNull Genero genero) {
        generoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Género no encontrado"));
        genero.setId(id);
        return generoRepository.save(genero);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        generoRepository.deleteById(id);
    }
}
