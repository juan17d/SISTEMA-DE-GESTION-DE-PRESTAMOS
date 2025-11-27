package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Multa;
import com.biblioteca.biblioteca.repository.MultaRepository;
import com.biblioteca.biblioteca.service.MultaService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MultaServiceImpl implements MultaService {

    private final MultaRepository multaRepository;

    public MultaServiceImpl(MultaRepository multaRepository) {
        this.multaRepository = multaRepository;
    }

    @Override
    public Multa crear(@NonNull Multa multa) { return multaRepository.save(multa); }

    @Override
    public Multa obtenerPorId(@NonNull Long id) {
        return multaRepository.findById(id).orElse(null);
    }

    @Override
    public List<Multa> listar() { return multaRepository.findAll(); }

    @Override
    public Multa actualizar(@NonNull Long id, @NonNull Multa multa) {
        multaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Multa no encontrada"));
        multa.setId(id);
        return multaRepository.save(multa);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        multaRepository.deleteById(id);
    }
}
