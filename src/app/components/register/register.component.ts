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
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) {}

  onRegister(): void {
    this.errorMessage = '';
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.toastService.success('¡Registro exitoso! Ya puedes iniciar sesión con tu cuenta.'); // Toast de éxito
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        const msg = err.error?.message || 'Error en el registro. Inténtalo de nuevo.';
        this.errorMessage = msg;
        this.toastService.error(msg); // Toast de error
      }
    });
  }
}
