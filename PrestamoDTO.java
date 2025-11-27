package com.biblioteca.biblioteca.dto;


public class PrestamoDTO {
    private Long usuarioId;
    private Long ejemplarId;

    public PrestamoDTO() {}

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public Long getEjemplarId() { return ejemplarId; }
    public void setEjemplarId(Long ejemplarId) { this.ejemplarId = ejemplarId; }
}