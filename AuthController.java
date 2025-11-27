package com.biblioteca.biblioteca.controller;

import com.biblioteca.biblioteca.entity.Usuario;
import com.biblioteca.biblioteca.repository.UsuarioRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private static final String SECRET_KEY = "miClaveSecretaParaJWT123456789012345678901234567890"; // En producción usar variable de entorno

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(request.getCorreo() != null ? request.getCorreo() : request.getUsername());
            
            if (usuario == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
            }

            if (!usuario.getPassword().equals(request.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
            }

            String token = generarToken(usuario);

            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al procesar la autenticación: " + e.getMessage()));
        }
    }

    private String generarToken(Usuario usuario) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
        
        String rolNombre = usuario.getRol() != null ? usuario.getRol().getNombre() : "CLIENTE";
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", usuario.getCorreo());
        claims.put("id", usuario.getId());
        claims.put("nombre", usuario.getNombre());
        claims.put("roles", Arrays.asList(rolNombre));
        claims.put("authorities", Arrays.asList(rolNombre));
        
        return Jwts.builder()
            .claims(claims)
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + 86400000)) // 24 horas
            .signWith(key)
            .compact();
    }

    public static class LoginRequest {
        private String correo;
        private String username;
        private String password;

        public String getCorreo() {
            return correo;
        }

        public void setCorreo(String correo) {
            this.correo = correo;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

