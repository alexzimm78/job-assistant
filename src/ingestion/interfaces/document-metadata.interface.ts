import {
    DocumentAccessLevel,
} from '../enums/document-access-level.enum';
import {
    DocumentLanguage,
} from '../enums/document-language.enum';
import {
    DocumentType,
} from '../enums/document-type.enum';

export interface DocumentMetadata {
    documentId: string;
    documentVersion: number;
    documentType: DocumentType;
    language: DocumentLanguage;
    accessLevel: DocumentAccessLevel;
}