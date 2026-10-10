import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LightingEvent } from '../../model/smart-iot.model';
import { SmartIotService } from '../../services/smart-iot.service';

@Component({
  selector: 'app-iot-lighting',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './iot-lighting.html',
  styleUrl: './iot-lighting.css'
})
export class IotLighting implements OnInit {
  private readonly smartIotService = inject(SmartIotService);
  private readonly datePipe = inject(DatePipe);

  events: LightingEvent[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.smartIotService.getLightingEvents().subscribe({
      next: events => {
        this.events = events;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error cargando luminarias:', error);
        this.errorMessage = 'No se pudieron cargar las activaciones de luminarias.';
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
