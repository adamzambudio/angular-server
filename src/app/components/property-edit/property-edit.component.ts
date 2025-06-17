import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService, Property } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-edit',
  imports: [FormsModule, CommonModule],
  templateUrl: './property-edit.component.html',
  styleUrl: './property-edit.component.css'
})
export class PropertyEditComponent implements OnInit {
  property: Property = {
    id: 0,
    title: '',
    description: '',
    price: 0,
    city: '',
    type: '',
    cp: 0,
    images: []
  };

  newImages: File[] = [];

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const token = this.authService.getToken();

    // console.log('Token al iniciar componente:', token);
    if (!token) {
      console.warn('No hay token, redirigiendo a login');
      this.router.navigate(['/login']);
      return;
    }

    if (!idParam) {
      console.error('No se especificó id de propiedad');
      this.router.navigate(['/mis-propiedades']);
      return;
    }

    const id = Number(idParam);
    // console.log('ID propiedad a cargar:', id);

    // Llamada para obtener propiedad con token (modificar servicio si es necesario)
    this.propertyService.getPropertyById(id, token).subscribe({
      next: (data: Property) => {
        // console.log('Propiedad recibida del servicio:', data);
        this.property = data;
      },
      error: (err: any) => {
        console.error('Error al cargar la propiedad:', err);
        this.router.navigate(['/mis-propiedades']);
      }
    });
  }

  async onSubmit(): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      await this.router.navigate(['/login']);
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

    this.newImages.forEach((file, i) => {
      formData.append('images[]', file);
    });

    this.propertyService.updatePropertyWithImages(this.property.id, formData, token).subscribe({
      next: () => this.router.navigate(['/mis-propiedades']),
      error: (err) => console.error('Error al guardar la propiedad:', err)
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      this.newImages = Array.from(target.files);
    }
  }


  deleteImage(imageId: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta imagen?')) {
      return;
    }

    const token = this.authService.getToken();
    if (!token) {
      alert('No estás autenticado para realizar esta acción.');
      this.router.navigate(['/login']);
      return;
    }

    this.propertyService.deleteImage(imageId, token).subscribe({
      next: () => {
        alert('Imagen eliminada correctamente.');
        // Actualiza la lista de imágenes en el frontend para reflejar la eliminación
        this.property.images = this.property.images.filter(img => img.id !== imageId);
      },
      error: (err) => {
        console.error('Error al eliminar la imagen:', err);
        alert('Error al eliminar la imagen. Asegúrate de tener permisos de administrador.');
      }
    });
  }

}
