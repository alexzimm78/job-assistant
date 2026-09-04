import {Injectable} from '@nestjs/common';

import {ConfigService} from '@nestjs/config';

import * as fs from 'fs/promises';
import * as path from 'path';

import {EmbeddingsService} from '../embeddings/embeddings.service';
import {VectorDocumentDto} from '../vector-storage/dto/vector-document.dto';
import {VectorStorageService} from '../vector-storage/vector-storage.service';

import {ChunkingService} from './chunking.service';
import {CleanService} from './clean.service';
import {IngestDocumentRequestDto} from './dto/ingest-document-request.dto';
import {MultiformatExtractor} from './extractors/multiformat.extractor';
import {DocumentChunk} from './interfaces/document-chunk.interface';
import {ExtractedDocument} from './interfaces/extracted-document.interface';

@Injectable()
export class IngestionService {
    constructor(
        private readonly chunkingService: ChunkingService,
        private readonly cleanService: CleanService,
        private readonly configService: ConfigService,
        private readonly embeddingsService: EmbeddingsService,
        private readonly vectorStorageService: VectorStorageService,
        private readonly multiformatExtractor: MultiformatExtractor,
    ) {
    }

    async ingestFile(filePath: string): Promise<number> {
        const buffer = await fs.readFile(filePath);
        const fileName = path.basename(filePath);

        const extractedDocuments =
            await this.multiformatExtractor.extract(
                buffer,
                fileName,
            );

        return this.ingestExtractedDocuments(
            extractedDocuments,
        );
    }

    async ingestUploadedFile(
        file: Express.Multer.File,
    ): Promise<number> {
        const extractedDocuments =
            await this.multiformatExtractor.extract(
                file.buffer,
                file.originalname,
            );

        return this.ingestExtractedDocuments(
            extractedDocuments,
        );
    }

    async ingestDocument(
        dto: IngestDocumentRequestDto,
    ): Promise<number> {
        const extractedDocuments: ExtractedDocument[] = [
            {
                content: dto.text,
                source: {
                    documentName: dto.fileName,
                },
            },
        ];

        return this.ingestExtractedDocuments(
            extractedDocuments,
        );
    }

    private async ingestExtractedDocuments(
        extractedDocuments: ExtractedDocument[],
    ): Promise<number> {
        const chunkSize = Number(
            this.configService.get<string>(
                'DOCUMENT_CHUNK_SIZE',
            ) ?? '1000',
        );

        const overlap = Number(
            this.configService.get<string>(
                'DOCUMENT_CHUNK_OVERLAP',
            ) ?? '200',
        );

        const chunks: DocumentChunk[] =
            extractedDocuments.flatMap(
                (document): DocumentChunk[] => {
                    const cleanedDocument: ExtractedDocument = {
                        content: this.cleanService.cleanText(
                            document.content,
                        ),
                        source: document.source,
                    };

                    return this.chunkingService.getDocumentChunks(
                        cleanedDocument,
                        chunkSize,
                        overlap,
                    );
                },
            );

        const documents: VectorDocumentDto[] =
            chunks.map(
                (
                    chunk: DocumentChunk,
                    index: number,
                ): VectorDocumentDto => ({
                    title:
                        `${chunk.source.documentName} – Teil ${index + 1}`,

                    content: chunk.content,

                    category: 'uploaded-document',

                    source: chunk.source.documentName,

                    chunkIndex: index,

                    documentName:
                    chunk.source.documentName,

                    pageNumber:
                    chunk.source.pageNumber,

                    chunkText: chunk.content,
                }),
            );

        const embeddings =
            await this.embeddingsService.createEmbeddings({
                texts: chunks.map(
                    (chunk: DocumentChunk) => chunk.content,
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
}