import { Injectable } from '@angular/core';
import { Observable, delay, map, of } from 'rxjs';

import {
  AccessDeniedEvent,
  IrrigationEvent,
  LightingEvent,
  SmartIotData,
  SmartIotEvent,
  SmartIotSummaryCard
} from '../model/smart-iot.model';

@Injectable({
  providedIn: 'root'
})
export class SmartIotService {
  getSmartIotData(): Observable<SmartIotData> {
    return of({
      isDemo: true,
      lighting: this.sortEvents(this.lightingEvents),
      accessDenied: this.sortEvents(this.accessDeniedEvents),
      irrigation: this.sortEvents(this.irrigationEvents)
    }).pipe(delay(250));
  }

  getSummaryCards(): Observable<SmartIotSummaryCard[]> {
    return this.getSmartIotData().pipe(
      map(data => [
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
          icon: 'psychiatry',
          title: 'Riego automático',
          description: 'Riego de plantas y activación de regadores en áreas verdes.',
          metricLabel: 'activaciones registradas',
          count: data.irrigation.length,
          route: '/app/smart-iot/irrigation',
          lastEvent: data.irrigation[0] ?? null
        }
      ])
    );
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
    }
  ];
}
