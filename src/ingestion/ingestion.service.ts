import {
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import * as fs from 'fs/promises';
import * as path from 'path';

import {
    EmbeddingsService,
} from '../embeddings/embeddings.service';
import {
    VectorDocumentDto,
} from '../vector-storage/dto/vector-document.dto';
import {
    VectorStorageService,
} from '../vector-storage/vector-storage.service';

import {
    ChunkingService,
} from './chunking.service';
import {
    CleanService,
} from './clean.service';
import {
    IngestDocumentMetadataDto,
} from './dto/ingest-document-metadata.dto';
import {
    IngestDocumentRequestDto,
} from './dto/ingest-document-request.dto';
import {
    DocumentVersionsConflictException,
} from './exceptions/document-versions-conflict.exception';
import {
    MultiformatExtractor,
} from './extractors/multiformat.extractor';
import {
    DocumentChunk,
} from './interfaces/document-chunk.interface';
import {
    DocumentMetadata,
} from './interfaces/document-metadata.interface';
import {
    ExtractedDocument,
} from './interfaces/extracted-document.interface';

@Injectable()
export class IngestionService {
    constructor(
        private readonly chunkingService:
        ChunkingService,
        private readonly cleanService:
        CleanService,
        private readonly configService:
        ConfigService,
        private readonly embeddingsService:
        EmbeddingsService,
        private readonly vectorStorageService:
        VectorStorageService,
        private readonly multiformatExtractor:
        MultiformatExtractor,
    ) {
    }

    async ingestFile(
        filePath: string,
        metadata: DocumentMetadata,
    ): Promise<number> {
        await this.prepareDocumentVersion(
            metadata,
        );

        const buffer =
            await fs.readFile(filePath);

        const fileName =
            path.basename(filePath);

        const extractedDocuments =
            await this.multiformatExtractor.extract(
                buffer,
                fileName,
            );

        return this.ingestExtractedDocuments(
            extractedDocuments,
            metadata,
        );
    }

    async ingestUploadedFile(
        file: Express.Multer.File,
        metadata: IngestDocumentMetadataDto,
    ): Promise<number> {
        await this.prepareDocumentVersion(
            metadata,
        );

        const extractedDocuments =
            await this.multiformatExtractor.extract(
                file.buffer,
                file.originalname,
            );

        return this.ingestExtractedDocuments(
            extractedDocuments,
            metadata,
        );
    }

    async ingestDocument(
        dto: IngestDocumentRequestDto,
    ): Promise<number> {
        const extractedDocuments:
            ExtractedDocument[] = [
            {
                content: dto.text,
                source: {
                    documentName:
                    dto.fileName,
                },
            },
        ];

        const metadata: DocumentMetadata = {
            documentId:
            dto.documentId,

            documentVersion:
            dto.documentVersion,

            documentType:
            dto.documentType,

            language:
            dto.language,

            accessLevel:
            dto.accessLevel,
        };

        await this.prepareDocumentVersion(
            metadata,
        );

        return this.ingestExtractedDocuments(
            extractedDocuments,
            metadata,
        );
    }

    private async ingestExtractedDocuments(
        extractedDocuments:
        ExtractedDocument[],
        metadata:
        DocumentMetadata,
    ): Promise<number> {
        const chunkSize =
            Number(
                this.configService.get<string>(
                    'DOCUMENT_CHUNK_SIZE',
                ) ?? '1000',
            );

        const overlap =
            Number(
                this.configService.get<string>(
                    'DOCUMENT_CHUNK_OVERLAP',
                ) ?? '200',
            );

        const chunks: DocumentChunk[] =
            extractedDocuments.flatMap(
                (
                    document,
                ): DocumentChunk[] => {
                    const cleanedDocument:
                        ExtractedDocument = {
                        content:
                            this.cleanService.cleanText(
                                document.content,
                            ),
                        source:
                        document.source,
                    };

                    return this.chunkingService
                        .getDocumentChunks(
                            cleanedDocument,
                            metadata,
                            chunkSize,
                            overlap,
                        );
                },
            );

        const documents:
            VectorDocumentDto[] =
            chunks.map(
                (
                    chunk,
                    index,
                ): VectorDocumentDto => ({
                    title:
                        `${chunk.source.documentName} – Teil ${index + 1}`,

                    content:
                    chunk.content,

                    category:
                        'uploaded-document',

                    source:
                    chunk.source.documentName,

                    chunkIndex:
                    index,

                    documentName:
                    chunk.source.documentName,

                    pageNumber:
                    chunk.source.pageNumber,

                    chunkText:
                    chunk.content,

                    documentId:
                    chunk.metadata.documentId,

                    documentVersion:
                    chunk.metadata.documentVersion,

                    documentType:
                    chunk.metadata.documentType,

                    language:
                    chunk.metadata.language,

                    accessLevel:
                    chunk.metadata.accessLevel,
                }),
            );

        const embeddings =
            await this.embeddingsService
                .createEmbeddings({
                    texts:
                        chunks.map(
                            (
                                chunk,
                            ) =>
                                chunk.content,
                        ),
                });

        return this.vectorStorageService
            .saveDocumentsWithEmbeddings(
                {
                    documents,
                },
                embeddings,
            );
    }

    // --------------------------------------------------
// DOKUMENTVERSION PRÜFEN UND ALTE VERSION ARCHIVIEREN
// --------------------------------------------------

    private async prepareDocumentVersion(
        metadata: DocumentMetadata,
    ): Promise<void> {
        const existingPoints =
            await this.vectorStorageService
                .findPointsByDocumentId(
                    metadata.documentId,
                );

        if (existingPoints.length === 0) {
            return;
        }

        const oldVersionValue =
            existingPoints[0]
                .payload.documentVersion;

        const oldVersion =
            Number(oldVersionValue);

        if (
            !Number.isInteger(oldVersion) ||
            oldVersion < 1
        ) {
            throw new InternalServerErrorException(
                'Die aktuelle Dokumentversion in Qdrant ist ungültig.',
            );
        }

        if (
            metadata.documentVersion <=
            oldVersion
        ) {
            throw new DocumentVersionsConflictException(
                oldVersion,
                metadata.documentVersion,
            );
        }

        await this.vectorStorageService
            .archivePoints(
                existingPoints,
            );

        await this.vectorStorageService
            .deletePoints(
                existingPoints,
            );
    }
}