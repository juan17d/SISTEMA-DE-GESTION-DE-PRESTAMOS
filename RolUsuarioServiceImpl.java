package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.RolUsuario;
import com.biblioteca.biblioteca.repository.RolUsuarioRepository;
import com.biblioteca.biblioteca.service.RolUsuarioService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolUsuarioServiceImpl implements RolUsuarioService {

    private final RolUsuarioRepository rolUsuarioRepository;

    public RolUsuarioServiceImpl(RolUsuarioRepository rolUsuarioRepository) {
        this.rolUsuarioRepository = rolUsuarioRepository;
    }

    @Override
    public RolUsuario crear(@NonNull RolUsuario rol) {
        return rolUsuarioRepository.save(rol);
    }

    @Override
    public RolUsuario obtenerPorId(@NonNull Long id) {
        return rolUsuarioRepository.findById(id).orElse(null);
    }

    @Override
    public List<RolUsuario> listar() {
        return rolUsuarioRepository.findAll();
    }

    @Override
    public RolUsuario actualizar(@NonNull Long id, @NonNull RolUsuario rol) {
        rolUsuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol de usuario no encontrado"));
        rol.setId(id);
        return rolUsuarioRepository.save(rol);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        rolUsuarioRepository.deleteById(id);
    }
}
