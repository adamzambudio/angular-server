import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-property-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent {
  property: any;
  showContactForm: boolean = false;
  contactForm = {
    nombre: '',
    telefono: '',
    email: '',
    mensaje: ''
  };

  constructor(private route: ActivatedRoute, private propertyService: PropertyService, public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.propertyService.getPropertyById(id).subscribe({
        next: (data) => {
          this.property = data;
        },
        error: (error) => {
          console.error('Error loading property:', error);
        }
      });
    }
  }



  comprarProperty() {
    if (!this.authService.isLoggedIn()) {
      const currentUrl = this.router.url;
      alert('Debes iniciar sesión para comprar esta propiedad.');
      this.router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
      return;
    }

    alert(`Has comprado la propiedad: ${this.property.name}`);
  }





  toggleContactForm() {
    this.showContactForm = !this.showContactForm;
  }


  submitContactForm() {
    // Validación simple de campos requeridos
    const { nombre, telefono, email, mensaje } = this.contactForm;

    if (!nombre || !telefono || !email || !mensaje) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validación de formato de teléfono (solo números, 9 dígitos)
    const telefonoValido = /^[0-9]{9}$/.test(telefono);
    if (!telefonoValido) {
      alert('El número de teléfono debe contener solo números y tener 9 dígitos.');
      return;
    }

    // Validación básica de email (ya se valida en el input, pero puede reforzarse)
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      alert('Por favor, introduce un correo electrónico válido.');
      return;
    }

    // Aquí va tu lógica de envío real, por ejemplo a una API o servicio
    console.log('Formulario enviado:', this.contactForm);

    // Mostrar confirmación al usuario
    alert('Formulario enviado correctamente. Gracias por contactarnos.');

    // Opcional: reiniciar el formulario
    this.contactForm = {
      nombre: '',
      telefono: '',
      email: '',
      mensaje: ''
    };

    // Cerrar el modal o formulario
    this.toggleContactForm();
  }
}
