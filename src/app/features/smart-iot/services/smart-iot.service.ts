import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import {
  AccessDeniedEvent,
  IrrigationEvent,
  LightingEvent,
  SmartIotData,
  SmartIotDashboardData,
  SmartIotEvent,
  SmartIotSummaryCard
} from '../model/smart-iot.model';

@Injectable({
  providedIn: 'root'
})
export class SmartIotService {
  getSmartIotData(): Observable<SmartIotData> {
    const lighting = this.sortEvents(this.lightingEvents);
    const accessDenied = this.sortEvents(this.accessDeniedEvents);
    const irrigation = this.sortEvents(this.irrigationEvents);

    return of({
      isDemo: true,
      lighting,
      accessDenied,
      irrigation,
      activityFrom: this.earliest([...lighting, ...accessDenied, ...irrigation]),
      activityTo: this.latest([...lighting, ...accessDenied, ...irrigation])
    }).pipe(delay(250));
  }

  getDashboard(): Observable<SmartIotDashboardData> {
    return this.getSmartIotData().pipe(
      map(data => ({
        cards: this.buildSummaryCards(data),
        activityFrom: data.activityFrom,
        activityTo: data.activityTo
      }))
    );
  }

  private buildSummaryCards(data: SmartIotData): SmartIotSummaryCard[] {
    return [
      {
        type: 'lighting',
        icon: 'lightbulb',
        title: 'Iluminaria',
        description: 'Sensores que encienden las luces en las zonas comunes.',
        metricLabel: 'encendidos registrados',
        count: data.lighting.length,
        route: '/app/smart-iot/lighting',
        lastEvent: data.lighting[0] ?? null
      },
      {
        type: 'access-control',
        icon: 'lock',
        title: 'Control de accesos',
        description: 'Cerradura inteligente y registro de usuarios con acceso denegado.',
        metricLabel: 'accesos denegados',
        count: data.accessDenied.length,
        route: '/app/smart-iot/access-control',
        lastEvent: data.accessDenied[0] ?? null
      },
      {
        type: 'irrigation',
        icon: 'water_drop',
        title: 'Riego automático',
        description: 'Riego de plantas y activación de regadores en áreas verdes.',
        metricLabel: 'activaciones registradas',
        count: data.irrigation.length,
        route: '/app/smart-iot/irrigation',
        lastEvent: data.irrigation[0] ?? null
      }
    ];
  }

  getLightingEvents(): Observable<LightingEvent[]> {
    return this.getSmartIotData().pipe(map(data => data.lighting));
  }

  getAccessDeniedEvents(): Observable<AccessDeniedEvent[]> {
    return this.getSmartIotData().pipe(map(data => data.accessDenied));
  }

  getIrrigationEvents(): Observable<IrrigationEvent[]> {
    return this.getSmartIotData().pipe(map(data => data.irrigation));
  }

  private sortEvents<T extends SmartIotEvent>(events: T[]): T[] {
    return [...events].sort(
      (first, second) =>
        new Date(second.occurredAt).getTime() - new Date(first.occurredAt).getTime()
    );
  }

  private earliest(events: SmartIotEvent[]): Date | null {
    if (events.length === 0) {
      return null;
    }

    return new Date(Math.min(...events.map(event => new Date(event.occurredAt).getTime())));
  }

  private latest(events: SmartIotEvent[]): Date | null {
    if (events.length === 0) {
      return null;
    }

    return new Date(Math.max(...events.map(event => new Date(event.occurredAt).getTime())));
  }

  private readonly accessDeniedEvents: AccessDeniedEvent[] = [
    {
      id: 'access-1',
      type: 'access-control',
      user: 'Carlos Méndez',
      reason: 'Permiso vencido',
      occurredAt: '2026-10-09T08:36:00'
    },
    {
      id: 'access-2',
      type: 'access-control',
      user: 'Lucía Torres',
      reason: 'Credencial no registrada',
      occurredAt: '2026-10-09T08:10:00'
    },
    {
      id: 'access-3',
      type: 'access-control',
      user: 'Diego Herrera',
      reason: 'Fuera del horario autorizado',
      occurredAt: '2026-10-09T07:45:00'
    },
    {
      id: 'access-4',
      type: 'access-control',
      user: 'Ana Morales',
      reason: 'Usuario deshabilitado',
      occurredAt: '2026-10-09T07:22:00'
    },
    {
      id: 'access-5',
      type: 'access-control',
      user: 'Sofía Navarro',
      reason: 'Tarjeta suspendida',
      occurredAt: '2026-10-08T21:02:00'
    },
    {
      id: 'access-6',
      type: 'access-control',
      user: 'Jorge Bianchi',
      reason: 'Fuera del horario autorizado',
      occurredAt: '2026-10-08T19:24:00'
    },
    {
      id: 'access-7',
      type: 'access-control',
      user: 'Valeria Castro',
      reason: 'Credencial no registrada',
      occurredAt: '2026-10-08T13:47:00'
    },
    {
      id: 'access-8',
      type: 'access-control',
      user: 'Martín Quiroz',
      reason: 'Permiso vencido',
      occurredAt: '2026-10-08T09:12:00'
    }
  ];

  private readonly lightingEvents: LightingEvent[] = [
    {
      id: 'light-1',
      type: 'lighting',
      zone: 'Vestíbulo torre A',
      device: 'Foco 018',
      occurredAt: '2026-10-09T08:42:00'
    },
    {
      id: 'light-2',
      type: 'lighting',
      zone: 'Pasillo - Piso 2',
      device: 'Foco 024',
      occurredAt: '2026-10-09T08:15:00'
    },
    {
      id: 'light-3',
      type: 'lighting',
      zone: 'Estacionamiento',
      device: 'Foco 006',
      occurredAt: '2026-10-09T07:58:00'
    },
    {
      id: 'light-4',
      type: 'lighting',
      zone: 'Escaleras torre B',
      device: 'Foco 032',
      occurredAt: '2026-10-09T07:30:00'
    },
    {
      id: 'light-5',
      type: 'lighting',
      zone: 'Estacionamiento',
      device: 'Foco 011',
      occurredAt: '2026-10-08T20:15:00'
    },
    {
      id: 'light-6',
      type: 'lighting',
      zone: 'Vestíbulo torre B',
      device: 'Foco 041',
      occurredAt: '2026-10-08T19:48:00'
    },
    {
      id: 'light-7',
      type: 'lighting',
      zone: 'Escaleras torre A',
      device: 'Foco 027',
      occurredAt: '2026-10-08T18:30:00'
    },
    {
      id: 'light-8',
      type: 'lighting',
      zone: 'Pasillo - Piso 1',
      device: 'Foco 003',
      occurredAt: '2026-10-08T17:05:00'
    }
  ];

  private readonly irrigationEvents: IrrigationEvent[] = [
    {
      id: 'irrigation-1',
      type: 'irrigation',
      sprinkler: 'Regador R-03',
      zone: 'Jardín central',
      occurredAt: '2026-10-09T06:30:00'
    },
    {
      id: 'irrigation-2',
      type: 'irrigation',
      sprinkler: 'Regador R-02',
      zone: 'Jardín torre B',
      occurredAt: '2026-10-09T06:15:00'
    },
    {
      id: 'irrigation-3',
      type: 'irrigation',
      sprinkler: 'Regador R-01',
      zone: 'Jardín torre A',
      occurredAt: '2026-10-09T06:00:00'
    },
    {
      id: 'irrigation-4',
      type: 'irrigation',
      sprinkler: 'Regador R-04',
      zone: 'Jardineras de acceso',
      occurredAt: '2026-10-09T05:45:00'
    },
    {
      id: 'irrigation-5',
      type: 'irrigation',
      sprinkler: 'Regador R-05',
      zone: 'Jardín de entrada',
      occurredAt: '2026-10-08T18:00:00'
    },
    {
      id: 'irrigation-6',
      type: 'irrigation',
      sprinkler: 'Regador R-01',
      zone: 'Jardín torre A',
      occurredAt: '2026-10-08T06:05:00'
    },
    {
      id: 'irrigation-7',
      type: 'irrigation',
      sprinkler: 'Regador R-03',
      zone: 'Jardín central',
      occurredAt: '2026-10-08T05:50:00'
    },
    {
      id: 'irrigation-8',
      type: 'irrigation',
      sprinkler: 'Regador R-06',
      zone: 'Área de picnic',
      occurredAt: '2026-10-08T05:35:00'
    }
  ];
}
