package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Ejemplar;
import com.biblioteca.biblioteca.service.EjemplarService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ejemplares")
@CrossOrigin(origins = "*")
public class EjemplarController {

    private final EjemplarService ejemplarService;

    public EjemplarController(EjemplarService ejemplarService) {
        this.ejemplarService = ejemplarService;
    }

    @GetMapping
    public List<Ejemplar> listar() {
        return ejemplarService.listar();
    }

    @GetMapping("/{id}")
    public Ejemplar obtener(@PathVariable @NonNull Long id) {
        return ejemplarService.obtenerPorId(id);
    }

    @PostMapping
    public Ejemplar crear(@RequestBody @NonNull Ejemplar ejemplar) {
        return ejemplarService.crear(ejemplar);
    }

    @PutMapping("/{id}")
    public Ejemplar actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull Ejemplar ejemplar) {
        return ejemplarService.actualizar(id, ejemplar);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        ejemplarService.eliminar(id);
    }
}
