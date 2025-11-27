package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.RolUsuario;
import com.biblioteca.biblioteca.service.RolUsuarioService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*")
public class RolUsuarioController {

    private final RolUsuarioService rolUsuarioService;

    public RolUsuarioController(RolUsuarioService rolUsuarioService) {
        this.rolUsuarioService = rolUsuarioService;
    }

    @GetMapping
    public List<RolUsuario> listar() {
        return rolUsuarioService.listar();
    }

    @GetMapping("/{id}")
    public RolUsuario obtener(@PathVariable @NonNull Long id) {
        return rolUsuarioService.obtenerPorId(id);
    }

    @PostMapping
    public RolUsuario crear(@RequestBody @NonNull RolUsuario rol) {
        return rolUsuarioService.crear(rol);
    }

    @PutMapping("/{id}")
    public RolUsuario actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull RolUsuario rol) {
        return rolUsuarioService.actualizar(id, rol);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        rolUsuarioService.eliminar(id);
    }
}
