package com.biblioteca.biblioteca.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "rol_usuarios")
public class RolUsuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nombre;

    @ManyToMany
    @JoinTable(
            name = "rol_permisos",
            joinColumns = @JoinColumn(name = "rol_id"),
            inverseJoinColumns = @JoinColumn(name = "permiso_id")
    )
    private Set<Permisos> permisos;

    public RolUsuario() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Set<Permisos> getPermisos() { return permisos; }
    public void setPermisos(Set<Permisos> permisos) { this.permisos = permisos; }
}