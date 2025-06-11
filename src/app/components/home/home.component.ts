import { Component, OnInit } from '@angular/core';
import { PropertyService, Property } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyFilterComponent } from '../property-filter/property-filter.component';
import { AuthService } from '../../services/auth.service';
import { FormatoPrecioPipe } from '../../pipes/formato-precio.pipe';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule, CommonModule, PropertyFilterComponent, FormatoPrecioPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  properties: any[] = [];
  isAdmin: boolean = false;

  constructor(
    private propertyService: PropertyService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.loadProperties();
    if (this.authService.isAdmin()) {
      console.log('Usuario administrador');
    }
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe((res: Property[]) => {
      this.properties = res;
    });
  }

  onPropertiesFiltered(filteredProperties: Property[]) {
    this.properties = filteredProperties;
  }

  toggleFavorite(property: any): void {
    property.isFavorite = !property.isFavorite;
  }


  trackByIndex(index: number, item: any): number {
    return index;
  }


}
