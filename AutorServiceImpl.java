package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Autor;
import com.biblioteca.biblioteca.repository.AutorRepository;
import com.biblioteca.biblioteca.service.AutorService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AutorServiceImpl implements AutorService {

    private final AutorRepository autorRepository;

    public AutorServiceImpl(AutorRepository autorRepository) {
        this.autorRepository = autorRepository;
    }

    @Override
    public Autor crear(@NonNull Autor autor) { return autorRepository.save(autor); }

    @Override
    public Autor obtenerPorId(@NonNull Long id) {
        return autorRepository.findById(id).orElse(null);
    }

    @Override
    public List<Autor> listar() { return autorRepository.findAll(); }

    @Override
    public Autor actualizar(@NonNull Long id, @NonNull Autor autor) {
        autorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Autor no encontrado"));
        autor.setId(id);
        return autorRepository.save(autor);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        autorRepository.deleteById(id);
    }
}
