package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Multa;
import com.biblioteca.biblioteca.service.MultaService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/multas")
@CrossOrigin(origins = "*")
public class MultaController {

    private final MultaService multaService;

    public MultaController(MultaService multaService) {
        this.multaService = multaService;
    }

    @GetMapping
    public List<Multa> listar() {
        return multaService.listar();
    }

    @GetMapping("/{id}")
    public Multa obtener(@PathVariable @NonNull Long id) {
        return multaService.obtenerPorId(id);
    }

    @PostMapping
    public Multa crear(@RequestBody @NonNull Multa multa) {
        return multaService.crear(multa);
    }

    @PutMapping("/{id}")
    public Multa actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull Multa multa) {
        return multaService.actualizar(id, multa);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        multaService.eliminar(id);
    }
}
