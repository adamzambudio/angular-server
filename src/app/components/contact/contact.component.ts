import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact',
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})

export class ContactComponent {
  formEnviado = false;

  datos = {
    nombre: '',
    email: '',
    mensaje: '',
    privacidad: false
  };

  enviarFormulario() {
    // Aquí puedes conectar con backend o servicio de email si quieres
    console.log('Formulario enviado:', this.datos);
    this.formEnviado = true;
  }
}
