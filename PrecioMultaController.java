package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.PrecioMulta;
import com.biblioteca.biblioteca.service.PrecioMultaService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/precios-multa")
@CrossOrigin(origins = "*")
public class PrecioMultaController {

    private final PrecioMultaService precioMultaService;

    public PrecioMultaController(PrecioMultaService precioMultaService) {
        this.precioMultaService = precioMultaService;
    }

    @GetMapping
    public List<PrecioMulta> listar() {
        return precioMultaService.listar();
    }

    @GetMapping("/actual")
    public PrecioMulta precioActual() {
        return precioMultaService.obtenerPrecioVigente();
    }

    @GetMapping("/{id}")
    public PrecioMulta obtener(@PathVariable @NonNull Long id) {
        return precioMultaService.obtenerPorId(id);
    }

    @PostMapping
    public PrecioMulta crear(@RequestBody @NonNull PrecioMulta precio) {
        return precioMultaService.crear(precio);
    }

    @PutMapping("/{id}")
    public PrecioMulta actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull PrecioMulta precio) {
        return precioMultaService.actualizar(id, precio);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        precioMultaService.eliminar(id);
    }
}
