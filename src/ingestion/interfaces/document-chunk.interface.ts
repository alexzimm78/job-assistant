import {
  DocumentMetadata,
} from './document-metadata.interface';
import {
  SourceMetadata,
} from './source-metadata.interface';

export interface DocumentChunk {
  content: string;
  source: SourceMetadata;
  metadata: DocumentMetadata;
}