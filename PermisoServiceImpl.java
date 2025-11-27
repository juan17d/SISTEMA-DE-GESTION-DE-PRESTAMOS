package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Permisos;
import com.biblioteca.biblioteca.repository.PermisoRepository;
import com.biblioteca.biblioteca.service.PermisoService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PermisoServiceImpl implements PermisoService {

    private final PermisoRepository permisoRepository;

    public PermisoServiceImpl(PermisoRepository permisoRepository) {
        this.permisoRepository = permisoRepository;
    }

    @Override
    public Permisos crear(@NonNull Permisos permiso) {
        return permisoRepository.save(permiso);
    }

    @Override
    public Permisos obtenerPorId(@NonNull Long id) {
        return permisoRepository.findById(id).orElse(null);
    }

    @Override
    public List<Permisos> listar() {
        return permisoRepository.findAll();
    }

    @Override
    public Permisos actualizar(@NonNull Long id, @NonNull Permisos permiso) {
        permisoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permiso no encontrado"));
        permiso.setId(id);
        return permisoRepository.save(permiso);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        permisoRepository.deleteById(id);
    }
}
