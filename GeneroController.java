package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Genero;
import com.biblioteca.biblioteca.service.GeneroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/generos")
@CrossOrigin(origins = "*")
public class GeneroController {

    @Autowired
    private GeneroService generoService;

    @GetMapping
    public List<Genero> list() {
        return generoService.listar();   //
    }

    @GetMapping("/{id}")
    public Genero getById(@PathVariable @NonNull Long id) {
        return generoService.obtenerPorId(id);
    }

    @PostMapping
    public Genero create(@RequestBody @NonNull Genero genero) {
        return generoService.crear(genero);
    }

    @PutMapping("/{id}")
    public Genero update(@PathVariable @NonNull Long id, @RequestBody @NonNull Genero genero) {
        return generoService.actualizar(id, genero);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable @NonNull Long id) {
        generoService.eliminar(id);
    }
}
