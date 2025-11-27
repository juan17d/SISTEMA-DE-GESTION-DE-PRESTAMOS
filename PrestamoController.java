package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.dto.PrestamoDTO;
import com.biblioteca.biblioteca.entity.Ejemplar;
import com.biblioteca.biblioteca.entity.Prestamo;
import com.biblioteca.biblioteca.entity.Usuario;
import com.biblioteca.biblioteca.service.PrestamoService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prestamos")
@CrossOrigin(origins = "*")
public class PrestamoController {

    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @GetMapping
    public List<Prestamo> listar() {
        return prestamoService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable @NonNull Long id) {
        Prestamo prestamo = prestamoService.obtenerPorId(id);
        if (prestamo == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prestamo);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody @NonNull PrestamoDTO request) {
        try {
            // Validar que los IDs sean válidos
            if (request.getUsuarioId() == null || request.getUsuarioId() <= 0) {
                return ResponseEntity.badRequest()
                        .body("Usuario ID es requerido y debe ser mayor a 0");
            }
            if (request.getEjemplarId() == null || request.getEjemplarId() <= 0) {
                return ResponseEntity.badRequest()
                        .body("Ejemplar ID es requerido y debe ser mayor a 0");
            }

            // Crear objeto Prestamo temporal solo con los IDs
            Prestamo prestamo = new Prestamo();

            // Crear Usuario temporal solo con el ID
            Usuario usuario = new Usuario();
            usuario.setId(request.getUsuarioId());
            prestamo.setUsuario(usuario);

            // Crear Ejemplar temporal solo con el ID
            Ejemplar ejemplar = new Ejemplar();
            ejemplar.setId(request.getEjemplarId());
            prestamo.setEjemplar(ejemplar);

            // El Service buscará las entidades reales y las reemplazará
            Prestamo creado = prestamoService.crear(prestamo);

            return ResponseEntity.ok(creado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable @NonNull Long id,
                                        @RequestBody @NonNull Prestamo prestamo) {
        try {
            Prestamo actualizado = prestamoService.actualizar(id, prestamo);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable @NonNull Long id) {
        try {
            prestamoService.eliminar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/devolver")
    public ResponseEntity<?> devolverLibro(@PathVariable @NonNull Long id) {
        try {
            Prestamo devuelto = prestamoService.devolverLibro(id);
            return ResponseEntity.ok(devuelto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}