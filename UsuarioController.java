package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.dto.UsuarioDTO;
import com.biblioteca.biblioteca.entity.Usuario;
import com.biblioteca.biblioteca.service.UsuarioService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioDTO> listar() {
        return usuarioService.listar().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public UsuarioDTO obtener(@PathVariable @NonNull Long id) {
        Usuario usuario = usuarioService.obtenerPorId(id);
        return usuario != null ? convertToDTO(usuario) : null;
    }

    @PostMapping
    public UsuarioDTO crear(@RequestBody @NonNull Usuario usuario) {
        Usuario creado = usuarioService.crear(usuario);
        return convertToDTO(creado);
    }

    @PutMapping("/{id}")
    public UsuarioDTO actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull Usuario usuario) {
        Usuario actualizado = usuarioService.actualizar(id, usuario);
        return convertToDTO(actualizado);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        usuarioService.eliminar(id);
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        UsuarioDTO.RolDTO rolDTO = null;
        if (usuario.getRol() != null) {
            rolDTO = new UsuarioDTO.RolDTO(usuario.getRol().getId(), usuario.getRol().getNombre());
        }
        return new UsuarioDTO(usuario.getId(), usuario.getNombre(), usuario.getCorreo(), rolDTO);
    }
}
