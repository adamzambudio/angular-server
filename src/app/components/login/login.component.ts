import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  onLogin(): void {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home'; 
        this.toastService.success('¡Bienvenido! Has iniciado sesión con éxito.'); // Toast de éxito
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        console.error('Error en el login:', err);
        const msg = err.error?.message || 'Usuario o contraseña incorrectos.';
        this.errorMessage = msg;
        this.toastService.error(msg); // Toast de error
      }
    });
  }
}
