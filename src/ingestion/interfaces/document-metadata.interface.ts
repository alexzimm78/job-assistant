import {
    DocumentLanguage,
} from '../enums/document-language.enum';
import {
    DocumentType,
} from '../enums/document-type.enum';

export interface DocumentMetadata {
    documentType: DocumentType;
    language: DocumentLanguage;
}