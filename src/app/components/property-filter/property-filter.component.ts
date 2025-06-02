import { Component, OnInit, Output, EventEmitter  } from '@angular/core';
import { Property, PropertyService  } from '../../services/property.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-filter',
  imports: [FormsModule, CommonModule],
  templateUrl: './property-filter.component.html',
  styleUrls: ['./property-filter.component.css']
})
export class PropertyFilterComponent implements OnInit {
  
  @Output() propertiesFiltered = new EventEmitter<Property[]>();

  
  cities: string[] = [];
  types: string[] = [];
  filters = {
    city: '',
    type: '',
    min: null as number | null,
    max: null as number | null
  };


  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadCities();
    this.loadTypes();
  }

  loadCities() {
    this.propertyService.getCities().subscribe(cities => {
      this.cities = cities;
    });
  }

  loadTypes(city?: string) {
    this.propertyService.getTypes(city).subscribe(types => {
      this.types = types;
    });
  }


  onCityChange() {
    this.filters.type = '';  // Limpiar el tipo si cambia la ciudad
    if (this.filters.city) {
      this.loadTypes(this.filters.city);
      this.loadPriceRange();
    } else {
      this.loadTypes(); // carga todos los tipos sin filtrar por ciudad
      this.filters.min = null;
      this.filters.max = null;
    }
  }

  onTypeChange() {
    this.loadPriceRange();
  }

  loadPriceRange() {
    this.propertyService.getPriceRange(this.filters.city, this.filters.type).subscribe(range => {
      this.filters.min = range.min;
      this.filters.max = range.max;
    });
  }

  applyFilters() {
    // Construimos el objeto filtros sin enviar valores vacíos
    const filters: any = {};
    if (this.filters.city) filters.city = this.filters.city;
    if (this.filters.type) filters.type = this.filters.type;
    if (this.filters.min !== null) filters.min = this.filters.min;
    if (this.filters.max !== null) filters.max = this.filters.max;

    this.propertyService.getProperties(filters).subscribe((properties: Property[]) => {
      this.propertiesFiltered.emit(properties); // Emitir lista filtrada
    });
  }

  resetFilters(): void {
  this.filters = {
    city: '',
    type: '',
    min: null,
    max: null
  };
  this.applyFilters();
}

}
