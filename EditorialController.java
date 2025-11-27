package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Editorial;
import com.biblioteca.biblioteca.service.EditorialService;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/editoriales")
@CrossOrigin(origins = "*")
public class EditorialController {

    private final EditorialService editorialService;

    public EditorialController(EditorialService editorialService) {
        this.editorialService = editorialService;
    }

    @GetMapping
    public List<Editorial> listar() {
        return editorialService.listar();
    }

    @GetMapping("/{id}")
    public Editorial obtener(@PathVariable @NonNull Long id) {
        return editorialService.obtenerPorId(id);
    }

    @PostMapping
    public Editorial crear(@RequestBody @NonNull Editorial editorial) {
        return editorialService.crear(editorial);
    }

    @PutMapping("/{id}")
    public Editorial actualizar(@PathVariable @NonNull Long id, @RequestBody @NonNull Editorial editorial) {
        return editorialService.actualizar(id, editorial);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable @NonNull Long id) {
        editorialService.eliminar(id);
    }
}
