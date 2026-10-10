import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AccessDeniedEvent } from '../../model/smart-iot.model';
import { SmartIotService } from '../../services/smart-iot.service';

@Component({
  selector: 'app-iot-access-control',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './iot-access-control.html',
  styleUrl: './iot-access-control.css'
})
export class IotAccessControl implements OnInit {
  private readonly smartIotService = inject(SmartIotService);
  private readonly datePipe = inject(DatePipe);

  events: AccessDeniedEvent[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.smartIotService.getAccessDeniedEvents().subscribe({
      next: events => {
        this.events = events;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error cargando accesos denegados:', error);
        this.errorMessage = 'No se pudieron cargar los intentos denegados.';
        this.isLoading = false;
      }
    });
  }

  formatDate(value: string): string {
    return this.datePipe.transform(value, 'dd/MM/yyyy') ?? value;
  }

  formatTime(value: string): string {
    return this.datePipe.transform(value, 'HH:mm') ?? value;
  }
}
