import { randomUUID } from 'crypto';

import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { EmbeddingsService } from '../embeddings/embeddings.service';

import { SaveVectorDocumentsRequestDto } from './dto/save-vector-documents-request.dto';
import { VectorDocumentDto } from './dto/vector-document.dto';
import { QdrantClient } from './qdrant/qdrant.client';
import { QdrantPoint } from './qdrant/models/qdrant-point.model';

@Injectable()
export class VectorStorageService {
    private readonly logger =
        new Logger(VectorStorageService.name);

    constructor(
        private readonly embeddingsService:
        EmbeddingsService,
        private readonly qdrantClient:
        QdrantClient,
    ) {}

    async saveDocuments(
        dto: SaveVectorDocumentsRequestDto,
    ): Promise<number> {
        const documents = dto.documents;

        const texts = documents.map(
            (document: VectorDocumentDto) =>
                document.content,
        );

        const embeddings =
            await this.embeddingsService
                .createEmbeddings({
                    texts,
                });

        if (
            embeddings.length !== documents.length
        ) {
            throw new InternalServerErrorException(
                'Anzahl der Embeddings stimmt nicht mit der Anzahl der Dokumente überein',
            );
        }

        const points: QdrantPoint[] =
            documents.map(
                (
                    document: VectorDocumentDto,
                    index: number,
                ): QdrantPoint => {
                    const payload: Record<
                        string,
                        string | number | boolean | null
                    > = {
                        title: document.title,
                        content: document.content,
                    };

                    if (document.category) {
                        payload.category =
                            document.category;
                    }

                    if (document.source) {
                        payload.source =
                            document.source;
                    }

                    return {
                        id: randomUUID(),
                        vector: embeddings[index],
                        payload,
                    };
                },
            );

        await this.qdrantClient.save(points);

        this.logger.log(
            `Dokumente gespeichert: ${points.length}`,
        );

        return points.length;
    }
}