import { SourceMetadata } from './source-metadata.interface';

export interface DocumentChunk {
  content: string;
  source: SourceMetadata;
}