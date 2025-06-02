import { Component, OnInit } from '@angular/core';
import { PropertyService, Property } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PropertyFilterComponent } from '../property-filter/property-filter.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, RouterModule, CommonModule, PropertyFilterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  properties: any[] = [];

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties() {
    this.propertyService.getProperties().subscribe((res: Property[]) => {
      this.properties = res;
    });
  }

  // Este método recibe las propiedades filtradas desde el componente filtro
  onPropertiesFiltered(filteredProperties: Property[]) {
    this.properties = filteredProperties;
  }
}
