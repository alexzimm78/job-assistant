import { Module } from '@nestjs/common';

import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorStorageModule } from '../vector-storage/vector-storage.module';

import { ChunkingService } from './chunking.service';
import { CleanService } from './clean.service';
import { DocumentIngestionController } from './document-ingestion.controller';
import { DocumentIngestionService } from './document-ingestion.service';
import { TxtExtractor } from './extractors/txt.extractor';
import { TextExtractorService } from './text-extractor.service';

@Module({
    imports: [
        EmbeddingsModule,
        VectorStorageModule,
    ],
    controllers: [
        DocumentIngestionController,
    ],
    providers: [
        ChunkingService,
        CleanService,
        DocumentIngestionService,
        TextExtractorService,
        TxtExtractor,
    ],
    exports: [
        DocumentIngestionService,
    ],
})
export class DocumentIngestionModule {}