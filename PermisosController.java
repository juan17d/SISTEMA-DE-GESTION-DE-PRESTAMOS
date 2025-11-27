package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Permisos;
import com.biblioteca.biblioteca.service.PermisoService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permisos")
@CrossOrigin(origins = "*")
public class PermisosController {

    private final PermisoService permisoService;

    public PermisosController(PermisoService permisoService) {
        this.permisoService = permisoService;
    }

    @GetMapping
    public List<Permisos> listar() {
        return permisoService.listar();
    }

    @GetMapping("/{id}")
    public Permisos obtener(@PathVariable @NonNull Long id) {
        return permisoService.obtenerPorId(id);
    }

    @PostMapping
    public Permisos crear(@RequestBody @NonNull Permisos permiso) {
        return permisoService.crear(permiso);
    }

    @PutMapping("/{id}")
    public Permisos actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull Permisos permiso) {
        return permisoService.actualizar(id, permiso);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        permisoService.eliminar(id);
    }
}
