import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  AccessDeniedEvent,
  IrrigationEvent,
  LightingEvent,
  SmartIotEvent,
  SmartIotSummaryCard
} from '../../model/smart-iot.model';
import { SmartIotService } from '../../services/smart-iot.service';

@Component({
  selector: 'app-smart-iot-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  providers: [DatePipe],
  templateUrl: './smart-iot-dashboard.html',
  styleUrl: './smart-iot-dashboard.css'
})
export class SmartIotDashboard implements OnInit {
  private readonly smartIotService = inject(SmartIotService);
  private readonly datePipe = inject(DatePipe);

  cards: SmartIotSummaryCard[] = [];
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.smartIotService.getSummaryCards().subscribe({
      next: cards => {
        this.cards = cards;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error cargando SmartIOT:', error);
        this.errorMessage = 'No se pudo cargar la actividad SmartIOT.';
        this.isLoading = false;
      }
    });
  }

  lastEventLabel(event: SmartIotEvent | null): string {
    if (!event) {
      return 'Sin registros';
    }

    const date = this.datePipe.transform(event.occurredAt, 'dd/MM/yyyy');
    const time = this.datePipe.transform(event.occurredAt, 'HH:mm');

    if (event.type === 'lighting') {
      const lighting = event as LightingEvent;
      return `${date} ${time} · ${lighting.device} · ${lighting.zone}`;
    }

    if (event.type === 'access-control') {
      const access = event as AccessDeniedEvent;
      return `${date} ${time} · ${access.user} · ${access.reason}`;
    }

    const irrigation = event as IrrigationEvent;
    return `${date} ${time} · ${irrigation.sprinkler} · ${irrigation.zone}`;
  }
}
