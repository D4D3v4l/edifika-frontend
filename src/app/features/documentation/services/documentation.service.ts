import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';

import {
  CriticalContact,
  DocumentationData,
  DocumentationDocument,
  DocumentationTab,
  EmergencyProtocol,
  UploadProtocolRequest
} from '../model/documentation.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentationService {
  readonly tabs: DocumentationTab[] = [
    { id: 'all', label: 'Todos los Documentos' },
    { id: 'laws', label: 'Leyes y Normativas' },
    { id: 'manuals', label: 'Manuales de Usuario' },
    { id: 'compliance', label: 'Cumplimiento (Compliance)' },
    { id: 'minutes', label: 'Actas de Asamblea' }
  ];

  getDocumentationCenter(): Observable<DocumentationData> {
    return of({
      isDemo: true,
      protocols: this.protocols,
      contacts: this.contacts,
      documents: this.documents
    }).pipe(delay(250));
  }

  uploadProtocol(_request: UploadProtocolRequest): Observable<never> {
    return throwError(
      () => new Error(
        'No existe un endpoint ni almacenamiento de archivos configurado para guardar protocolos.'
      )
    );
  }

  private readonly protocols: EmergencyProtocol[] = [
    {
      id: 'fire',
      icon: 'local_fire_department',
      title: 'Protocolo de Incendio',
      description: 'Rutas de evacuación y manejo de extintores.',
      documentName: 'Protocolo de Incendio'
    },
    {
      id: 'first-aid',
      icon: 'medical_services',
      title: 'Primeros Auxilios',
      description: 'Guía de acción inmediata y ubicación de DEA.',
      documentName: 'Primeros Auxilios'
    },
    {
      id: 'intrusion',
      icon: 'security',
      title: 'Seguridad Intrusión',
      description: 'Bloqueo perimetral y alerta a autoridades.',
      documentName: 'Seguridad Intrusión'
    }
  ];

  private readonly contacts: CriticalContact[] = [
    {
      id: 'firefighters',
      label: 'Bomberos',
      value: 'Demo: 116',
      note: 'Contacto referencial de demostración',
      icon: 'local_fire_department'
    },
    {
      id: 'police',
      label: 'Policía',
      value: 'Demo: 105',
      note: 'Contacto referencial de demostración',
      icon: 'local_police'
    },
    {
      id: 'maintenance',
      label: 'Mantenimiento',
      value: 'Demo: Anexo 204',
      note: 'Contacto referencial de demostración',
      icon: 'engineering'
    }
  ];

  private readonly documents: DocumentationDocument[] = [
    {
      id: 'horizontal-property-rules',
      category: 'laws',
      icon: 'gavel',
      name: 'Reglamento de Propiedad Horizontal',
      description: 'Normativa interna de convivencia, uso de áreas comunes y responsabilidades.',
      updatedAt: '2026-09-18',
      fileType: 'PDF',
      fileSize: '2.4 MB',
      version: 'v3.1'
    },
    {
      id: 'boilers-manual',
      category: 'manuals',
      icon: 'settings',
      name: 'Manual Operativo de Calderas',
      description: 'Procedimiento de operación preventiva y atención básica de incidencias.',
      updatedAt: '2026-08-27',
      fileType: 'PDF',
      fileSize: '4.8 MB',
      version: 'v2.0'
    },
    {
      id: 'fire-certification-2024',
      category: 'compliance',
      icon: 'verified',
      name: 'Certificación contra Incendios 2024',
      description: 'Registro documental de inspección y cumplimiento de seguridad.',
      updatedAt: '2026-07-12',
      fileType: 'PDF',
      fileSize: '1.9 MB'
    },
    {
      id: 'ordinary-assembly-march',
      category: 'minutes',
      icon: 'groups',
      name: 'Acta Asamblea Ordinaria - Marzo',
      description: 'Acuerdos de asamblea, asistencia y decisiones administrativas.',
      updatedAt: '2026-03-29',
      fileType: 'PDF',
      fileSize: '980 KB',
      version: 'v1.0'
    }
  ];
}
