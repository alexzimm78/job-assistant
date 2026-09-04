import { randomUUID } from 'crypto';

import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import { EmbeddingsService } from '../embeddings/embeddings.service';
import { Embeddings } from '../embeddings/models/embedding.model';

import { SaveVectorDocumentsRequestDto } from './dto/save-vector-documents-request.dto';
import { SearchVectorDocumentsRequestDto } from './dto/search-vector-documents-request.dto';
import { VectorDocumentDto } from './dto/vector-document.dto';
import { QdrantPoint } from './qdrant/models/qdrant-point.model';
import { QdrantSearchResult } from './qdrant/models/qdrant-search-result.model';
import { QdrantClient } from './qdrant/qdrant.client';

@Injectable()
export class VectorStorageService {
    private readonly logger =
        new Logger(
            VectorStorageService.name,
        );

    constructor(
        private readonly embeddingsService:
        EmbeddingsService,

        private readonly qdrantClient:
        QdrantClient,
    ) {}

    // --------------------------------------------------
    // DOKUMENTE INKLUSIVE EMBEDDINGS SPEICHERN
    // --------------------------------------------------

    async saveDocuments(
        dto: SaveVectorDocumentsRequestDto,
    ): Promise<number> {
        const texts =
            dto.documents.map(
                (
                    document:
                    VectorDocumentDto,
                ) => document.content,
            );

        const embeddings =
            await this.embeddingsService
                .createEmbeddings({
                    texts,
                });

        return this.saveDocumentsWithEmbeddings(
            dto,
            embeddings,
        );
    }

    // --------------------------------------------------
    // BEREITS ERSTELLTE EMBEDDINGS SPEICHERN
    // --------------------------------------------------

    async saveDocumentsWithEmbeddings(
        dto: SaveVectorDocumentsRequestDto,
        embeddings: Embeddings,
    ): Promise<number> {
        const documents =
            dto.documents;

        if (
            embeddings.length !==
            documents.length
        ) {
            throw new InternalServerErrorException(
                'Anzahl der Embeddings stimmt nicht mit der Anzahl der Dokumente überein',
            );
        }

        const points: QdrantPoint[] =
            documents.map(
                (
                    document:
                    VectorDocumentDto,
                    index: number,
                ): QdrantPoint => {
                    const payload: Record<
                        string,
                        string |
                        number |
                        boolean |
                        null
                    > = {
                        title:
                        document.title,
                        content:
                        document.content,
                        text:
                        document.content,
                    };

                    if (document.category) {
                        payload.category =
                            document.category;
                    }

                    if (document.source) {
                        payload.source =
                            document.source;
                    }

                    if (
                        document.chunkIndex !==
                        undefined
                    ) {
                        payload.chunkIndex =
                            document.chunkIndex;
                    }

                    if (document.documentName) {
                        payload.documentName =
                            document.documentName;
                    }

                    if (
                        document.pageNumber !==
                        undefined
                    ) {
                        payload.pageNumber =
                            document.pageNumber;
                    }

                    if (document.chunkText) {
                        payload.chunkText =
                            document.chunkText;
                    }

                    return {
                        id:
                            randomUUID(),
                        vector:
                            embeddings[index],
                        payload,
                    };
                },
            );

        await this.qdrantClient.save(
            points,
        );

        this.logger.log(
            `Dokumente gespeichert: ${points.length}`,
        );

        return points.length;
    }

    // --------------------------------------------------
    // SEMANTISCHE SUCHE
    // --------------------------------------------------

    async searchDocuments(
        dto: SearchVectorDocumentsRequestDto,
    ): Promise<QdrantSearchResult[]> {
        const embeddings =
            await this.embeddingsService
                .createEmbeddings({
                    texts: [
                        dto.query,
                    ],
                });

        const queryVector =
            embeddings[0];

        if (!queryVector) {
            throw new InternalServerErrorException(
                'Für die Suchanfrage wurde kein Embedding erstellt',
            );
        }

        const results =
            await this.qdrantClient.search(
                queryVector,
                dto.limit,
            );

        this.logger.log(
            `Semantische Suche abgeschlossen: ${results.length} Ergebnisse`,
        );

        return results;
    }

    // --------------------------------------------------
    // ÄHNLICHE CHUNKS MIT VORHANDENEM EMBEDDING SUCHEN
    // --------------------------------------------------

    async searchSimilar(
        embedding: number[],
        topK: number = 5,
    ): Promise<QdrantSearchResult[]> {
        const results =
            await this.qdrantClient.search(
                embedding,
                topK,
            );

        this.logger.log(
            `Top-${topK} ähnliche Chunks gefunden: ${results.length}`,
        );

        return results;
    }
}