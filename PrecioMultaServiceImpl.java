package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.PrecioMulta;
import com.biblioteca.biblioteca.repository.PrecioMultaRepository;
import com.biblioteca.biblioteca.service.PrecioMultaService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrecioMultaServiceImpl implements PrecioMultaService {

    private final PrecioMultaRepository precioMultaRepository;

    public PrecioMultaServiceImpl(PrecioMultaRepository precioMultaRepository) {
        this.precioMultaRepository = precioMultaRepository;
    }

    @Override
    public PrecioMulta crear(@NonNull PrecioMulta precioMulta) {
        return precioMultaRepository.save(precioMulta);
    }

    @Override
    public PrecioMulta obtenerPorId(@NonNull Long id) {
        return precioMultaRepository.findById(id).orElse(null);
    }

    @Override
    public List<PrecioMulta> listar() {
        return precioMultaRepository.findAll();
    }

    @Override
    public PrecioMulta actualizar(@NonNull Long id, @NonNull PrecioMulta precioMulta) {
        precioMultaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Precio de multa no encontrado"));
        precioMulta.setId(id);
        return precioMultaRepository.save(precioMulta);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        precioMultaRepository.deleteById(id);
    }

    @Override
    public PrecioMulta obtenerPrecioVigente() {
        return precioMultaRepository.findTopByOrderByVigenteDesdeDesc();
    }
}
