export type DocumentCategory =
  | 'all'
  | 'laws'
  | 'manuals'
  | 'compliance'
  | 'minutes';

export interface DocumentationTab {
  id: DocumentCategory;
  label: string;
}

export interface EmergencyProtocol {
  id: string;
  icon: string;
  title: string;
  description: string;
  documentName: string;
  fileUrl?: string;
}

export interface CriticalContact {
  id: string;
  label: string;
  value: string;
  note: string;
  icon: string;
}

export interface DocumentationDocument {
  id: string;
  category: Exclude<DocumentCategory, 'all'>;
  icon: string;
  name: string;
  description: string;
  updatedAt: string;
  fileType: string;
  fileSize: string;
  version?: string;
  fileUrl?: string;
}

export interface DocumentationData {
  isDemo: boolean;
  protocols: EmergencyProtocol[];
  contacts: CriticalContact[];
  documents: DocumentationDocument[];
}

export interface UploadProtocolRequest {
  title: string;
  category: Exclude<DocumentCategory, 'all'>;
  description: string;
  file: File | null;
}
