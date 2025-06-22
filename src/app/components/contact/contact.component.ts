import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  formEnviado = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      mensaje: ['', [Validators.required, Validators.maxLength(500)]],
      privacidad: [false, [Validators.requiredTrue]]
    });
  }

  enviarFormulario() {
    if (!this.authService.isLoggedIn()) {
      this.toastService.info('Debes iniciar sesión para enviar el formulario.');
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      }, 2000);
      return;
    }

    const form = this.contactForm;

    if (this.contactForm.invalid) {
      // Revisamos específicamente el email
      if (this.contactForm.controls['email'].errors) {
        if (this.contactForm.controls['email'].errors['email'] || this.contactForm.controls['email'].errors['pattern']) {
          this.toastService.error('El correo electrónico no es válido.');
          return;
        }
      }
      
      if (this.contactForm.invalid) {
        this.toastService.error('Por favor, completa todos los campos obligatorios.');
        return;
      }
      
      if (this.contactForm.controls['privacidad'].hasError('required') || this.contactForm.controls['privacidad'].hasError('requiredTrue')) {
        this.toastService.error('Debes aceptar la política de privacidad.');
        return;
      }
    }

    // Aquí iría el envío real del formulario (por ejemplo, llamar a un servicio)
    console.log(this.contactForm.value);

    this.toastService.success('Formulario enviado correctamente.');
    this.formEnviado = true;
  }
}
