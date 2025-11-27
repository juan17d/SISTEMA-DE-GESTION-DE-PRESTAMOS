package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Autor;
import com.biblioteca.biblioteca.service.AutorService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/autores")
@CrossOrigin("*")
public class AutorController {

    private final AutorService autorService;

    public AutorController(AutorService autorService) {
        this.autorService = autorService;
    }

    // Lista todos los autores
    @GetMapping
    public List<Autor> listar() {
        return autorService.listar();
    }

    @GetMapping("/{id}")
    public Autor obtenerPorId(@PathVariable @NonNull Long id) {
        return autorService.obtenerPorId(id);
    }


    @PostMapping
    public Autor crear(@RequestBody @NonNull Autor autor) {
        return autorService.crear(autor);
    }

    @PutMapping("/{id}")
    public Autor actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull Autor autor) {
        return autorService.actualizar(id, autor);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        autorService.eliminar(id);
    }
}
