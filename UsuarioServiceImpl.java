package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.RolUsuario;
import com.biblioteca.biblioteca.entity.Usuario;
import com.biblioteca.biblioteca.repository.RolUsuarioRepository;
import com.biblioteca.biblioteca.repository.UsuarioRepository;
import com.biblioteca.biblioteca.service.UsuarioService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolUsuarioRepository rolUsuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository,
                              RolUsuarioRepository rolUsuarioRepository) {
        this.usuarioRepository = usuarioRepository;
        this.rolUsuarioRepository = rolUsuarioRepository;
    }

    @Override
    @Transactional
    public Usuario crear(@NonNull Usuario usuario) {
        // ✅ Obtener el rol managed de la base de datos
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            RolUsuario rolReal = rolUsuarioRepository.findById(usuario.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + usuario.getRol().getId()));
            usuario.setRol(rolReal);
        }

        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario obtenerPorId(@NonNull Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    @Override
    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    @Override
    @Transactional
    public Usuario actualizar(@NonNull Long id, @NonNull Usuario usuario) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existente.setNombre(usuario.getNombre());
        existente.setCorreo(usuario.getCorreo());
        if (usuario.getPassword() != null && !usuario.getPassword().isEmpty()) {
            existente.setPassword(usuario.getPassword());
        }

        // ✅ Obtener el rol managed si cambió
        if (usuario.getRol() != null && usuario.getRol().getId() != null) {
            RolUsuario rolReal = rolUsuarioRepository.findById(usuario.getRol().getId())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado con ID: " + usuario.getRol().getId()));
            existente.setRol(rolReal);
        }

        return usuarioRepository.save(existente);
    }

    @Override
    @Transactional
    public void eliminar(@NonNull Long id) {
        usuarioRepository.deleteById(id);
    }
}