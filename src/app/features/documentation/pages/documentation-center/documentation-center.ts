import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginService } from '../../../auth/services/login-service';
import {
  CriticalContact,
  DocumentCategory,
  DocumentationDocument,
  DocumentationTab,
  EmergencyProtocol,
  UploadProtocolRequest
} from '../../model/documentation.model';
import { DocumentationService } from '../../services/documentation.service';

@Component({
  selector: 'app-documentation-center',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe],
  templateUrl: './documentation-center.html',
  styleUrl: './documentation-center.css'
})
export class DocumentationCenter implements OnInit {
  private readonly documentationService = inject(DocumentationService);
  private readonly loginService = inject(LoginService);
  private readonly datePipe = inject(DatePipe);

  tabs: DocumentationTab[] = this.documentationService.tabs;
  selectedCategory: DocumentCategory = 'all';

  protocols: EmergencyProtocol[] = [];
  contacts: CriticalContact[] = [];
  documents: DocumentationDocument[] = [];

  isLoading = false;
  errorMessage = '';
  uploadMessage = '';
  isDemo = false;
  showUploadForm = false;

  uploadForm: UploadProtocolRequest = {
    title: '',
    category: 'manuals',
    description: '',
    file: null
  };

  ngOnInit(): void {
    this.loadDocumentation();
  }

  get canUploadDocuments(): boolean {
    const currentUser = this.loginService.getCurrentUser() as { roles?: string[] } | null;

    return currentUser?.roles?.some(role => role.toUpperCase() === 'ADMIN') ?? false;
  }

  get filteredDocuments(): DocumentationDocument[] {
    if (this.selectedCategory === 'all') {
      return this.documents;
    }

    return this.documents.filter(document => document.category === this.selectedCategory);
  }

  loadDocumentation(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.documentationService.getDocumentationCenter().subscribe({
      next: data => {
        this.protocols = data.protocols;
        this.contacts = data.contacts;
        this.documents = data.documents;
        this.isDemo = data.isDemo;
        this.isLoading = false;
      },
      error: error => {
        console.error('Error cargando documentación:', error);
        this.errorMessage = 'No se pudo cargar el Centro de Documentación.';
        this.isLoading = false;
      }
    });
  }

  selectCategory(category: DocumentCategory): void {
    this.selectedCategory = category;
  }

  openUploadForm(): void {
    if (!this.canUploadDocuments) {
      this.uploadMessage = 'No tienes permisos para subir protocolos.';
      return;
    }

    this.uploadMessage = '';
    this.showUploadForm = true;
  }

  closeUploadForm(): void {
    this.showUploadForm = false;
    this.uploadMessage = '';
    this.uploadForm = {
      title: '',
      category: 'manuals',
      description: '',
      file: null
    };
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.uploadForm.file = input.files?.[0] ?? null;
  }

  submitUpload(): void {
    if (
      !this.uploadForm.title.trim() ||
      !this.uploadForm.description.trim() ||
      !this.uploadForm.file
    ) {
      this.uploadMessage = 'Completa título, descripción y archivo antes de continuar.';
      return;
    }

    this.documentationService.uploadProtocol(this.uploadForm).subscribe({
      error: error => {
        this.uploadMessage = error.message;
      }
    });
  }

  openDocument(document: DocumentationDocument | EmergencyProtocol): void {
    if (!document.fileUrl) {
      this.uploadMessage = 'Este documento de demostración no tiene archivo asociado.';
      return;
    }

    window.open(document.fileUrl, '_blank', 'noopener');
  }

  downloadDocument(document: DocumentationDocument): void {
    if (!document.fileUrl) {
      this.uploadMessage = 'No hay archivo asociado para descargar.';
      return;
    }

    const anchor = window.document.createElement('a');
    anchor.href = document.fileUrl;
    anchor.download = document.name;
    anchor.click();
  }

  formatDate(value: string): string {
    return this.datePipe.transform(value, 'dd/MM/yyyy') ?? value;
  }
}
