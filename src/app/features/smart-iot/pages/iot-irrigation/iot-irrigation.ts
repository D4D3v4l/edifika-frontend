import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { IrrigationEvent } from '../../model/smart-iot.model';
import { SmartIotService } from '../../services/smart-iot.service';

@Component({
  selector: 'app-iot-irrigation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './iot-irrigation.html',
  styleUrl: './iot-irrigation.css'
})
export class IotIrrigation implements OnInit {
  private readonly smartIotService = inject(SmartIotService);
  private readonly datePipe = inject(DatePipe);

  events: IrrigationEvent[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.smartIotService.getIrrigationEvents().subscribe({
      next: events => {
        this.events = events;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error cargando riego automático:', error);
        this.errorMessage = 'No se pudieron cargar las activaciones de riego.';
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
