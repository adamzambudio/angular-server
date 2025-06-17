// src/app/components/favorites/favorites.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService, Property } from '../../services/property.service';
import { AuthService } from '../../services/auth.service';
import { FormatoPrecioPipe } from '../../pipes/formato-precio.pipe';
import { ToastService } from '../../services/toast.service'; // Para notificaciones

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormatoPrecioPipe
  ],
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritesComponent implements OnInit {
  favoriteProperties: Property[] = [];
  private userFavoritesKeyPrefix = 'userFavorites_';

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteProperties();
  }

  loadFavoriteProperties(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      // Esto no debería pasar si el AuthGuard funciona, pero es una seguridad
      this.toastService.error('Usuario no logeado. No se pueden cargar favoritos.');
      this.favoriteProperties = [];
      return;
    }

    const favoriteIds = this.getUserFavorites(userId);

    if (favoriteIds.length === 0) {
      this.favoriteProperties = [];
      return;
    }

    // Cargar todas las propiedades y luego filtrar las favoritas
    this.propertyService.getProperties().subscribe({
      next: (allProperties: Property[]) => {
        this.favoriteProperties = allProperties.filter(p => favoriteIds.includes(p.id));
        // Marcar explícitamente como favoritas (útil si hay botón de desmarcar aquí)
        this.favoriteProperties.forEach(p => p.isFavorite = true);

        if (this.favoriteProperties.length === 0 && favoriteIds.length > 0) {
            this.toastService.info('Algunas propiedades favoritas ya no están disponibles.');
            // Opcional: Limpiar favoritos del localStorage si las propiedades ya no existen.
            // this.saveUserFavorites(userId, this.favoriteProperties.map(p => p.id));
        }
      },
      error: (err) => {
        console.error('Error al cargar propiedades para favoritos:', err);
        this.toastService.error('Error al cargar las propiedades favoritas.');
      }
    });
  }

  private getUserFavorites(userId: string): number[] {
    try {
      const favoritesString = localStorage.getItem(this.userFavoritesKeyPrefix + userId);
      return favoritesString ? JSON.parse(favoritesString) : [];
    } catch (e) {
      console.error('Error al parsear favoritos de localStorage', e);
      return [];
    }
  }

  private saveUserFavorites(userId: string, favorites: number[]): void {
    localStorage.setItem(this.userFavoritesKeyPrefix + userId, JSON.stringify(favorites));
  }

  // Permite desmarcar desde la vista de favoritos
  toggleFavoriteFromFavorites(property: Property): void {
    const userId = this.authService.getUserId();
    if (!userId) return; // No debería pasar aquí por el guard

    let favorites = this.getUserFavorites(userId);
    const index = favorites.indexOf(property.id);

    if (index > -1) {
      favorites.splice(index, 1); // Quitar de favoritos
      this.toastService.error('Propiedad eliminada de favoritos.');
    }
    // No añadimos aquí, solo quitamos

    this.saveUserFavorites(userId, favorites);
    // Actualizar la lista mostrada
    this.favoriteProperties = this.favoriteProperties.filter(p => p.id !== property.id);
  }
}