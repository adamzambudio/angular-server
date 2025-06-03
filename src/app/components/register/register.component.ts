import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styles: ``
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(): void {
    this.authService.register(this.name, this.email, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Error en el registro';
      }
    });
  }
}
