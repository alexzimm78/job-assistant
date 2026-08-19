import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmbeddingsModule } from '../embeddings/embeddings.module';

import { QdrantClient } from './qdrant/qdrant.client';
import { VectorStorageController } from './vector-storage.controller';
import { VectorStorageService } from './vector-storage.service';

@Module({
    imports: [
        ConfigModule,
        EmbeddingsModule,
    ],
    controllers: [
        VectorStorageController,
    ],
    providers: [
        VectorStorageService,
        QdrantClient,
    ],
    exports: [
        VectorStorageService,
    ],
})
export class VectorStorageModule {}