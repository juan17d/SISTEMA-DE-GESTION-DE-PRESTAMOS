package com.biblioteca.biblioteca.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "precio_multas")
public class PrecioMulta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "valor_por_dia", nullable = false)
    private Double valorPorDia;

    @Column(name = "vigente_desde", nullable = false)
    private LocalDate vigenteDesde;

    public PrecioMulta() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Double getValorPorDia() { return valorPorDia; }
    public void setValorPorDia(Double valorPorDia) { this.valorPorDia = valorPorDia; }
    public LocalDate getVigenteDesde() { return vigenteDesde; }
    public void setVigenteDesde(LocalDate vigenteDesde) { this.vigenteDesde = vigenteDesde; }
}
