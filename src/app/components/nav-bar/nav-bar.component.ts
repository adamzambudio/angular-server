import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {

  constructor(public authService: AuthService, private router: Router) {}


  logout() {
    this.authService.logout();
    this.router.navigate(['/dashboard']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']); // Cambia la ruta si tienes otro componente
  }

}
