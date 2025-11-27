    package com.biblioteca.biblioteca.service.impl;

    import com.biblioteca.biblioteca.entity.*;
    import com.biblioteca.biblioteca.repository.*;
    import com.biblioteca.biblioteca.service.PrestamoService;
    import org.springframework.lang.NonNull;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.time.LocalDate;
    import java.time.temporal.ChronoUnit;
    import java.util.List;

    @Service
    public class PrestamoServiceImpl implements PrestamoService {

        private final PrestamoRepository prestamoRepository;
        private final UsuarioRepository usuarioRepository;
        private final EjemplarRepository ejemplarRepository;
        private final MultaRepository multaRepository;
        private final PrecioMultaRepository precioMultaRepository;

        public PrestamoServiceImpl(PrestamoRepository prestamoRepository,
                                   UsuarioRepository usuarioRepository,
                                   EjemplarRepository ejemplarRepository,
                                   MultaRepository multaRepository,
                                   PrecioMultaRepository precioMultaRepository) {
            this.prestamoRepository = prestamoRepository;
            this.usuarioRepository = usuarioRepository;
            this.ejemplarRepository = ejemplarRepository;
            this.multaRepository = multaRepository;
            this.precioMultaRepository = precioMultaRepository;
        }

        @Override
        @Transactional
        public Prestamo crear(@NonNull Prestamo prestamo) {
            // Extraer IDs del objeto recibido
            Long usuarioId = prestamo.getUsuario() != null ? prestamo.getUsuario().getId() : null;
            Long ejemplarId = prestamo.getEjemplar() != null ? prestamo.getEjemplar().getId() : null;

            // Validar IDs
            if (usuarioId == null || usuarioId <= 0) {
                throw new RuntimeException("ID de usuario inválido o no proporcionado");
            }
            if (ejemplarId == null || ejemplarId <= 0) {
                throw new RuntimeException("ID de ejemplar inválido o no proporcionado");
            }

            // Buscar entidades reales en la BD
            Usuario usuarioReal = usuarioRepository.findById(usuarioId)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + usuarioId));

            Ejemplar ejemplarReal = ejemplarRepository.findById(ejemplarId)
                    .orElseThrow(() -> new RuntimeException("Ejemplar no encontrado con ID: " + ejemplarId));

            // Validar disponibilidad
            if (!Boolean.TRUE.equals(ejemplarReal.getDisponible())) {
                throw new RuntimeException("Ejemplar no disponible");
            }

            // ✅ SOLUCIÓN: Crear un objeto completamente NUEVO sin tocar el que recibimos
            Prestamo prestamoNuevo = new Prestamo();
            prestamoNuevo.setUsuario(usuarioReal);
            prestamoNuevo.setEjemplar(ejemplarReal);
            prestamoNuevo.setFechaPrestamo(LocalDate.now());
            prestamoNuevo.setFechaDevolucion(LocalDate.now().plusDays(15));
            prestamoNuevo.setDevuelto(false);

            // Guardar el préstamo
            Prestamo guardado = prestamoRepository.save(prestamoNuevo);

            // Actualizar disponibilidad del ejemplar
            ejemplarReal.setDisponible(false);
            ejemplarRepository.save(ejemplarReal);

            return guardado;
        }

        @Override
        public Prestamo obtenerPorId(@NonNull Long id) {
            return prestamoRepository.findById(id).orElse(null);
        }

        @Override
        public List<Prestamo> listar() {
            return prestamoRepository.findAll();
        }

        @Override
        @Transactional
        public Prestamo actualizar(@NonNull Long id, @NonNull Prestamo prestamo) {
            Prestamo existente = prestamoRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Prestamo no encontrado"));

            existente.setDevuelto(prestamo.getDevuelto());

            return prestamoRepository.save(existente);
        }

        @Override
        @Transactional
        public void eliminar(@NonNull Long id) {
            if (prestamoRepository.existsById(id)) {
                prestamoRepository.deleteById(id);
            }
        }

        @Override
        @Transactional
        public Prestamo devolverLibro(@NonNull Long idPrestamo) {
            Prestamo p = prestamoRepository.findById(idPrestamo)
                    .orElseThrow(() -> new RuntimeException("Prestamo no encontrado"));

            if (Boolean.TRUE.equals(p.getDevuelto())) {
                throw new RuntimeException("Ya fue devuelto");
            }

            LocalDate fechaDevolucionOriginal = p.getFechaDevolucion();

            p.setDevuelto(true);
            p.setFechaDevolucion(LocalDate.now());

            Ejemplar e = p.getEjemplar();
            e.setDisponible(true);
            ejemplarRepository.save(e);

            LocalDate esperado = fechaDevolucionOriginal;
            LocalDate real = LocalDate.now();

            if (real.isAfter(esperado)) {
                long dias = ChronoUnit.DAYS.between(esperado, real);

                PrecioMulta precio = precioMultaRepository.findTopByOrderByVigenteDesdeDesc();
                if (precio == null) {
                    throw new RuntimeException("No hay precio de multa configurado");
                }

                double monto = precio.getValorPorDia() * dias;

                Multa m = new Multa();
                m.setTotal(monto);
                m.setDiasAtraso((int) dias);
                m.setPrecioMulta(precio);
                m.setPrestamo(p);

                multaRepository.save(m);
                p.setMulta(m);
            }

            return prestamoRepository.save(p);
        }

        @Transactional
        public void procesarVencidos() {
            List<Prestamo> list = prestamoRepository.findByDevueltoFalseAndFechaDevolucionBefore(LocalDate.now());

            for (Prestamo p : list) {
                if (p.getMulta() == null) {
                    long dias = ChronoUnit.DAYS.between(p.getFechaDevolucion(), LocalDate.now());

                    PrecioMulta precio = precioMultaRepository.findTopByOrderByVigenteDesdeDesc();
                    if (precio == null) {
                        continue;
                    }

                    double monto = precio.getValorPorDia() * dias;

                    Multa m = new Multa();
                    m.setTotal(monto);
                    m.setDiasAtraso((int) dias);
                    m.setPrecioMulta(precio);
                    m.setPrestamo(p);

                    multaRepository.save(m);
                    p.setMulta(m);
                    prestamoRepository.save(p);
                }
            }
        }
    }