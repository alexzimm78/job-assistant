import { Module } from '@nestjs/common';

import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { VectorStorageModule } from '../vector-storage/vector-storage.module';

import { ChunkingService } from './chunking.service';
import { CleanService } from './clean.service';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { TxtExtractor } from './extractors/txt.extractor';
import { TextExtractorService } from './text-extractor.service';

@Module({
    imports: [
        EmbeddingsModule,
        VectorStorageModule,
    ],
    controllers: [
        IngestionController,
    ],
    providers: [
        ChunkingService,
        CleanService,
        IngestionService,
        TextExtractorService,
        TxtExtractor,
    ],
    exports: [
        IngestionService,
    ],
})
export class IngestionModule {}