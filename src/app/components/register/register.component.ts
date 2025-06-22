import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  privacyPolicyAccepted = false;
  errorMessage = '';

  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  onRegister(): void {
    this.errorMessage = '';

    // 1. Comprobar si algún campo obligatorio está vacío
    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.toastService.error('Faltan campos obligatorios.');
      return;
    }

    // 2. Validar email
    if (!this.validateEmail(this.email)) {
      this.toastService.error('El correo electrónico no es válido.');
      return;
    }

    // 3. Validar contraseña
    if (!this.validatePassword(this.password)) {
      this.toastService.error('La contraseña debe tener al menos 8 caracteres, una mayúscula y un número.');
      return;
    }

    // 4. Validar política de privacidad
    if (!this.privacyPolicyAccepted) {
      this.toastService.error('Debes aceptar la política de privacidad.');
      return;
    }

    // Si todo es válido, proceder al registro
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.toastService.success('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        const msg = err.error?.message || 'Error en el registro. Inténtalo de nuevo.';
        this.errorMessage = msg;
        this.toastService.error(msg);
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
