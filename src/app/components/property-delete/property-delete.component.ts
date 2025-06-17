// src/app/property-delete/property-delete.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // This is okay if you're not injecting PropertyService
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-delete',
  templateUrl: './property-delete.component.html',
  imports: [],
  styleUrl: './property-delete.component.css'
})
export class PropertyDeleteComponent {
  @Input() propertyId!: number;
  @Input() buttonText: string = 'Eliminar Propiedad';
  @Output() propertyDeleted = new EventEmitter<number>();

  // private apiUrl = 'http://localhost:8000/api/properties'; // You can remove this now as you're using PropertyService

  constructor(
    private propertyService: PropertyService, // Inject PropertyService
    private authService: AuthService,         // Inject AuthService to get token
    private router: Router
  ) { }

  confirmAndDelete(): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta propiedad? Esta acción no se puede deshacer.')) {
      this.deleteProperty();
    }
  }

  private deleteProperty(): void {
    if (!this.propertyId) {
      console.error('No se proporcionó un ID de propiedad para eliminar.');
      return;
    }

    const token = this.authService.getToken(); // Get the token from AuthService
    if (!token) {
      console.error('No hay token de autenticación disponible. No se puede eliminar la propiedad.');
      // Optional: Redirect to login if no token is found
      this.router.navigate(['/login']);
      return;
    }

    this.propertyService.deleteProperty(this.propertyId, token).subscribe({
      next: (response) => {
        console.log('Propiedad eliminada correctamente', response);
        alert('Propiedad eliminada con éxito.');
        this.propertyDeleted.emit(this.propertyId);
        // If you redirect here, the parent's onPropertyDeleted might not run
        // this.router.navigate(['/admin/properties']);
      },
      error: (error) => {
        console.error('Error al eliminar la propiedad', error);
        alert('Error al eliminar la propiedad. Asegúrate de tener permisos de administrador.'); // More specific alert
      }
    });
  }
}