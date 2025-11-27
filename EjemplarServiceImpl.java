package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Ejemplar;
import com.biblioteca.biblioteca.repository.EjemplarRepository;
import com.biblioteca.biblioteca.service.EjemplarService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EjemplarServiceImpl implements EjemplarService {

    private final EjemplarRepository ejemplarRepository;

    public EjemplarServiceImpl(EjemplarRepository ejemplarRepository) {
        this.ejemplarRepository = ejemplarRepository;
    }

    @Override
    public Ejemplar crear(@NonNull Ejemplar ejemplar) { return ejemplarRepository.save(ejemplar); }

    @Override
    public Ejemplar obtenerPorId(@NonNull Long id) {
        return ejemplarRepository.findById(id).orElse(null);
    }

    @Override
    public List<Ejemplar> listar() { return ejemplarRepository.findAll(); }

    @Override
    public Ejemplar actualizar(@NonNull Long id, @NonNull Ejemplar ejemplar) {
        ejemplarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ejemplar no encontrado"));
        ejemplar.setId(id);
        return ejemplarRepository.save(ejemplar);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        ejemplarRepository.deleteById(id);
    }
}
