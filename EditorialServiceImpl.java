package com.biblioteca.biblioteca.service.impl;

import com.biblioteca.biblioteca.entity.Editorial;
import com.biblioteca.biblioteca.repository.EditorialRepository;
import com.biblioteca.biblioteca.service.EditorialService;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EditorialServiceImpl implements EditorialService {

    private final EditorialRepository editorialRepository;

    public EditorialServiceImpl(EditorialRepository editorialRepository) {
        this.editorialRepository = editorialRepository;
    }

    @Override
    public Editorial crear(@NonNull Editorial editorial) { return editorialRepository.save(editorial); }

    @Override
    public Editorial obtenerPorId(@NonNull Long id) {
        return editorialRepository.findById(id).orElse(null);
    }

    @Override
    public List<Editorial> listar() { return editorialRepository.findAll(); }

    @Override
    public Editorial actualizar(@NonNull Long id, @NonNull Editorial editorial) {
        editorialRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Editorial no encontrada"));
        editorial.setId(id);
        return editorialRepository.save(editorial);
    }

    @Override
    public void eliminar(@NonNull Long id) {
        editorialRepository.deleteById(id);
    }
}
