import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-property-add',
  imports: [FormsModule, CommonModule],
  templateUrl: './property-add.component.html',
  styleUrl: './property-add.component.css'
})
export class PropertyAddComponent {
property = {
    title: '',
    description: '',
    price: 0,
    city: '',
    type: '',
    cp: 0,
    address: '',
  };

  newImages: File[] = [];

  constructor(private propertyService: PropertyService, private router: Router) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      if (files.length > 20) {
        alert('No puedes subir más de 20 imágenes.');
        return;
      }
      this.newImages = files;
    }
  }

  onSubmit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.property.title);
    formData.append('description', this.property.description);
    formData.append('price', this.property.price.toString());
    formData.append('city', this.property.city);
    formData.append('type', this.property.type);
    formData.append('cp', this.property.cp.toString());
    formData.append('address', this.property.address || '');

    // IMPORTANTE: el backend espera 'images' sin corchetes
    this.newImages.forEach(file => {
      formData.append('images[]', file);
    });

    this.propertyService.createPropertyWithImages(formData, token).subscribe({
      next: () => this.router.navigate(['/mis-propiedades']),
      error: err => console.error('Error al crear propiedad:', err)
    });
  }
}
