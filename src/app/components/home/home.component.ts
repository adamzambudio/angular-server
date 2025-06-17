import { Component, OnInit } from '@angular/core';
import { PropertyService, Property } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyFilterComponent } from '../property-filter/property-filter.component';
import { AuthService } from '../../services/auth.service';
import { FormatoPrecioPipe } from '../../pipes/formato-precio.pipe';
import { PropertyDeleteComponent } from '../property-delete/property-delete.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule, CommonModule, PropertyFilterComponent, FormatoPrecioPipe, PropertyDeleteComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  properties: Property[] = [];
  private userFavoritesKeyPrefix = 'userFavorites_';

  constructor(
    private propertyService: PropertyService,
    public authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    if (this.authService.isAdmin()) {
      console.log('Usuario administrador');
    }
  }

   loadProperties() {
    this.propertyService.getProperties().subscribe((res: Property[]) => {
      // Marcar propiedades favoritas al cargar
      const currentUserId = this.authService.getUserId();
      const favorites = currentUserId ? this.getUserFavorites(currentUserId) : [];

      this.properties = res.map(p => ({
        ...p,
        isFavorite: favorites.some(favId => favId === p.id)
      }));
    });
  }

  onPropertiesFiltered(filteredProperties: Property[]) {
    // Re-aplicar estado de favoritos a las propiedades filtradas
    const currentUserId = this.authService.getUserId();
    const favorites = currentUserId ? this.getUserFavorites(currentUserId) : [];

    this.properties = filteredProperties.map(p => ({
      ...p,
      isFavorite: favorites.some(favId => favId === p.id)
    }));
  }

  toggleFavorite(property: Property): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.info('Necesitas iniciar sesión para añadir propiedades a favoritos.');
      setTimeout(() => {
        this.router.navigate(['/login']); // Redirige después de un breve momento
      }, 2500);
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastService.error('No se pudo obtener el ID de usuario. Vuelve a iniciar sesión.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
      return;
    }

    let favorites = this.getUserFavorites(userId);

    property.isFavorite = !property.isFavorite; // Cambiar el estado visual inmediatamente

    if (property.isFavorite) {
      if (!favorites.includes(property.id)) {
        favorites.push(property.id);
        this.toastService.success('Propiedad añadida a favoritos.');
      }
    } else {
      favorites = favorites.filter(favId => favId !== property.id);
      this.toastService.error('Propiedad eliminada de favoritos.');
    }

    this.saveUserFavorites(userId, favorites);
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


  trackByIndex(index: number, item: any): number {
    return index;
  }


  onPropertyDeleted(deletedPropertyId: number): void {
    this.properties = this.properties.filter(p => p.id !== deletedPropertyId);
    console.log(`Propiedad con ID ${deletedPropertyId} eliminada de la lista en el Home.`);

    // También eliminar de favoritos si estaba
    const userId = this.authService.getUserId();
    if (userId) {
      let favorites = this.getUserFavorites(userId);
      favorites = favorites.filter(favId => favId !== deletedPropertyId);
      this.saveUserFavorites(userId, favorites);
    }
  }

}
