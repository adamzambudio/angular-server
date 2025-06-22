import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule, CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  @ViewChild('navbarCollapse', { static: false }) navbarCollapse!: ElementRef;

  constructor(public authService: AuthService, private router: Router, private toastService: ToastService) {}


  logout() {
    this.authService.logout();
    this.toastService.success('Sesión cerrada correctamente.');
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

  closeNavbar() {
    if (this.navbarCollapse?.nativeElement?.classList.contains('show')) {
      this.navbarCollapse.nativeElement.classList.remove('show');
    }
  }
}
