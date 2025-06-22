declare var bootstrap: any;
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormatoPrecioPipe } from '../../pipes/formato-precio.pipe';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-property-detail',
  imports: [FormsModule, CommonModule, FormatoPrecioPipe],
  templateUrl: './property-detail.component.html',
  styleUrl: './property-detail.component.css'
})
export class PropertyDetailComponent {
  
  private userFavoritesKeyPrefix = 'userFavorites_';


  property: any;
  showContactForm: boolean = false;
  contactForm = {
    nombre: '',
    telefono: '',
    email: '',
    mensaje: '',
    privacyPolicyAccepted: false
  };

  showPrivacyError = false;


  @ViewChild('lightboxModal') lightboxModal!: ElementRef;
  @ViewChild('lightboxCarousel') lightboxCarousel!: ElementRef;
  lightboxInstance: any;
  lightboxIndex: number = 0;


  constructor(
    private route: ActivatedRoute, 
    private propertyService: PropertyService, 
    public authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = +idParam;
      this.propertyService.getPropertyById(id).subscribe({
        next: (data) => {
          this.property = data;

          const currentUserId = this.authService.getUserId();
          const favorites = currentUserId ? this.getUserFavorites(currentUserId) : [];
          this.property.isFavorite = favorites.includes(this.property.id);

          setTimeout(() => {
            this.lightboxInstance = new bootstrap.Modal(this.lightboxModal.nativeElement);
          }, 0);
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
    // Primero comprobamos si el usuario está logeado
    if (!this.authService.isLoggedIn()) {
      this.toastService.info('Debes iniciar sesión para enviar el formulario.');
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }, 2000);
      return;
    }

    const { nombre, telefono, email, mensaje, privacyPolicyAccepted } = this.contactForm;

    // Validación manual adicional por seguridad
    if (!nombre || !telefono || !email || !mensaje) {
      this.toastService.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    // Validación del teléfono
    const telefonoValido = /^[0-9]{9}$/.test(telefono);
    if (!telefonoValido) {
      this.toastService.error('El número de teléfono debe tener 9 dígitos.');
      return;
    }

    // Validación de email (ya lo valida el input pero reforzamos)
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      this.toastService.error('El correo electrónico no es válido.');
      return;
    }

    // Validación de la casilla de privacidad
    if (!privacyPolicyAccepted) {
      this.showPrivacyError = true;
      this.toastService.error('Debes aceptar la política de privacidad.');
      return;
    } else {
      this.showPrivacyError = false;
    }

    // Aquí iría el envío real a tu backend o API
    console.log('Formulario enviado:', this.contactForm);
    this.toastService.success('Formulario enviado correctamente.');

    // Limpiar formulario
    this.contactForm = {
      nombre: '',
      telefono: '',
      email: '',
      mensaje: '',
      privacyPolicyAccepted: false
    };
    this.showPrivacyError = false;

    // Opcional: ocultar el formulario
    this.toggleContactForm();
  }


  openLightbox(index: number) {
    this.lightboxIndex = index;

    // Abrir modal bootstrap manualmente
    const modalEl = this.lightboxModal.nativeElement;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();

    // Espera que el modal esté visible y luego mueve el carousel
    setTimeout(() => {
      const carouselEl = this.lightboxCarousel.nativeElement;
      const carousel = bootstrap.Carousel.getInstance(carouselEl) 
        || new bootstrap.Carousel(carouselEl, { interval: false });

      carousel.to(this.lightboxIndex);
    }, 200);
  }


  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.info('Necesitas iniciar sesión para añadir propiedades a favoritos.');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2500);
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      this.toastService.error('No se pudo obtener el ID de usuario.');
      return;
    }

    let favorites = this.getUserFavorites(userId);
    this.property.isFavorite = !this.property.isFavorite;

    if (this.property.isFavorite) {
      if (!favorites.includes(this.property.id)) {
        favorites.push(this.property.id);
        this.toastService.success('Propiedad añadida a favoritos.');
      }
    } else {
      favorites = favorites.filter(favId => favId !== this.property.id);
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


}
