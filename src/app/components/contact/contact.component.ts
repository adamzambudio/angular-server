import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})

export class ContactComponent {
  name = '';
  email = '';
  message = '';

  sendMessage() {
    if (this.name == '' || this.email == '' || this.message == '') {
      alert('Por favor, completa todos los campos.');
      } else {
        alert(`Mensaje enviado por ${this.name} (${this.email}): ${this.message}`);
      }
  }

  resetForm() {
    this.name = '';
    this.email = '';
    this.message = '';
  }
}
