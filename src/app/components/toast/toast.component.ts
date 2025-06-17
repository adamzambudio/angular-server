// src/app/shared/toast/toast.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';
import { Subscription, timer } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations'; // Para animaciones

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit, OnDestroy {
  currentToast: ToastMessage | null = null;
  private toastSubscription!: Subscription;
  private timerSubscription!: Subscription;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toastState.subscribe(
      (message: ToastMessage) => {
        this.currentToast = message;
        this.startTimer(message.duration || 3000);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private startTimer(duration: number): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.timerSubscription = timer(duration).subscribe(() => {
      this.currentToast = null;
    });
  }

  closeToast(): void {
    this.currentToast = null;
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  getToastClasses(): string {
    if (!this.currentToast) {
      return '';
    }
    let classes = 'toast-message ';
    switch (this.currentToast.type) {
      case 'success': classes += 'toast-success'; break;
      case 'error': classes += 'toast-error'; break;
      case 'info': classes += 'toast-info'; break;
    }
    return classes;
  }
}