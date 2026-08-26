import { Module } from '@nestjs/common';

import { VectorStorageModule } from '../vector-storage/vector-storage.module';

import { ChunkingService } from './chunking.service';
import { DocumentIngestionController } from './document-ingestion.controller';
import { DocumentIngestionService } from './document-ingestion.service';

@Module({
    imports: [
        VectorStorageModule,
    ],
    controllers: [
        DocumentIngestionController,
    ],
    providers: [
        ChunkingService,
        DocumentIngestionService,
    ],
    exports: [
        DocumentIngestionService,
    ],
})
export class DocumentIngestionModule {}