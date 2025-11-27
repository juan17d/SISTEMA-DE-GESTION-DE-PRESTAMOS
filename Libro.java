package com.biblioteca.biblioteca.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "libros")
public class Libro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @ManyToMany
    @JoinTable(
            name = "libro_autores",
            joinColumns = @JoinColumn(name = "libro_id"),
            inverseJoinColumns = @JoinColumn(name = "autor_id")
    )
    @JsonIgnoreProperties("libros")
    private List<Autor> autores;

    @ManyToOne
    @JoinColumn(name = "editorial_id", nullable = false)
    @JsonIgnoreProperties("libros")
    private Editorial editorial;

    @ManyToOne
    @JoinColumn(name = "genero_id", nullable = false)
    @JsonIgnoreProperties("libros")
    private Genero genero;

    @OneToMany(mappedBy = "libro")
    @JsonIgnoreProperties("libro")
    private List<Ejemplar> ejemplares;

    public Libro() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public List<Autor> getAutores() { return autores; }
    public void setAutores(List<Autor> autores) { this.autores = autores; }

    public Editorial getEditorial() { return editorial; }
    public void setEditorial(Editorial editorial) { this.editorial = editorial; }

    public Genero getGenero() { return genero; }
    public void setGenero(Genero genero) { this.genero = genero; }

    public List<Ejemplar> getEjemplares() { return ejemplares; }
    public void setEjemplares(List<Ejemplar> ejemplares) { this.ejemplares = ejemplares; }
}