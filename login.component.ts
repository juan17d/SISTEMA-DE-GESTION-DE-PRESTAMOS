import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    console.log("===> EJECUTANDO LOGIN <===");

    if (this.loginForm.invalid) {
      console.log("Formulario inválido", this.loginForm.value);
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;
    console.log("Datos enviados:", { username, password });

    this.authService.login(username, password).subscribe({
      next: () => {
        console.log("✔ Login correcto");

        const payload = this.authService.getPayload();
        console.log("Payload decodificado:", payload);

        if (!payload) {
          console.error("❌ Error: el token no tiene payload");
          return;
        }

        // ACEPTA roles: ['ADMIN'], authorities: ['ADMIN'], o lo que devuelva tu backend
        const roles = payload.roles ?? payload.authorities ?? [];
        const role = roles[0];

        console.log("ROL DETECTADO:", role);

        if (role === 'ADMIN') {
          console.log("Redirigiendo → /admin");
          this.router.navigateByUrl('/admin');
        }
        else if (role === 'BIBLIOTECARIO') {
          console.log("Redirigiendo → /bibliotecario");
          this.router.navigateByUrl('/bibliotecario');
        }
        else {
          console.log("Redirigiendo → /cliente");
          this.router.navigateByUrl('/cliente');
        }
      },

      error: (err) => {
        console.error("❌ Error de login:", err);
        console.error("Error completo:", JSON.stringify(err, null, 2));
        console.error("Status:", err.status);
        console.error("Message:", err.message);
        console.error("Error body:", err.error);
        
        let mensaje = 'Credenciales incorrectas';
        if (err.status === 0) {
          mensaje = 'No se pudo conectar al servidor. ¿Está corriendo el backend en http://localhost:8080?';
        } else if (err.status === 401) {
          mensaje = 'Credenciales incorrectas';
        } else if (err.status === 404) {
          mensaje = 'Endpoint no encontrado. Verifica la URL del backend.';
        } else if (err.status >= 500) {
          mensaje = 'Error del servidor. Intenta más tarde.';
        }
        alert(mensaje);
      }
    });
  }
}
