package com.biblioteca.biblioteca.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "multas")
public class Multa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "prestamo_id", nullable = false, unique = true)
    private Prestamo prestamo;

    @ManyToOne
    @JoinColumn(name = "precio_multa_id", nullable = false)
    private PrecioMulta precioMulta;

    @Column(name = "dias_atraso", nullable = false)
    private Integer diasAtraso;

    @Column(nullable = false)
    private Double total;

    // Constructores
    public Multa() {}

    public Multa(Prestamo prestamo, PrecioMulta precioMulta, Integer diasAtraso, Double total) {
        this.prestamo = prestamo;
        this.precioMulta = precioMulta;
        this.diasAtraso = diasAtraso;
        this.total = total;
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Prestamo getPrestamo() {
        return prestamo;
    }

    public void setPrestamo(Prestamo prestamo) {
        this.prestamo = prestamo;
    }

    public PrecioMulta getPrecioMulta() {
        return precioMulta;
    }

    public void setPrecioMulta(PrecioMulta precioMulta) {
        this.precioMulta = precioMulta;
    }

    public Integer getDiasAtraso() {
        return diasAtraso;
    }

    public void setDiasAtraso(Integer diasAtraso) {
        this.diasAtraso = diasAtraso;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return "Multa{" +
                "id=" + id +
                ", prestamo=" + (prestamo != null ? prestamo.getId() : null) +
                ", precioMulta=" + (precioMulta != null ? precioMulta.getId() : null) +
                ", diasAtraso=" + diasAtraso +
                ", total=" + total +
                '}';
    }
}