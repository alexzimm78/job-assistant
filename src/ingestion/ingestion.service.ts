import {Injectable} from '@nestjs/common';

import {ConfigService} from '@nestjs/config';

import {EmbeddingsService} from '../embeddings/embeddings.service';
import {VectorDocumentDto} from '../vector-storage/dto/vector-document.dto';
import {VectorStorageService} from '../vector-storage/vector-storage.service';

import {ChunkingService} from './chunking.service';
import {CleanService} from './clean.service';
import {IngestDocumentRequestDto} from './dto/ingest-document-request.dto';
import {TextExtractorService} from './text-extractor.service';

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
        private readonly textExtractorService:
        TextExtractorService,
    ) {
    }

    // --------------------------------------------------
    // TXT-DATEI ÜBER DATEIPFAD EINLESEN
    // --------------------------------------------------

    async ingestFile(
        filePath: string,
    ): Promise<number> {
        const text =
            await this.textExtractorService
                .extractText(
                    filePath,
                );

        const fileName =
            filePath
                .split(/[\\/]/)
                .pop()
            ?? 'unknown-file.txt';

        return this.ingestDocument({
            fileName,
            text,
        });
    }

    // --------------------------------------------------
    // HOCHGELADENE TXT-DATEI VERARBEITEN
    // --------------------------------------------------

    async ingestUploadedFile(
        file: Express.Multer.File,
    ): Promise<number> {
        const text =
            this.textExtractorService
                .extractTextFromBuffer(
                    file.buffer,
                    file.originalname,
                );

        return this.ingestDocument({
            fileName:
            file.originalname,
            text,
        });
    }

    // --------------------------------------------------
    // VOLLSTÄNDIGE INGESTION PIPELINE KOORDINIEREN
    // --------------------------------------------------

    async ingestDocument(
        dto: IngestDocumentRequestDto,
    ): Promise<number> {
        // 1. Text bereinigen
        const cleanedText =
            this.cleanService.cleanText(
                dto.text,
            );

        // 2. Konfigurierbare Chunking-Parameter auslesen
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

        // 2.1 Text mit fester Größe und Overlap aufteilen
        const chunks =
            this.chunkingService.getChunks(
                cleanedText,
                chunkSize,
                overlap,
            );

        // 3. Dokument und Chunk-Metadaten vorbereiten
        const documents: VectorDocumentDto[] =
            chunks.map(
                (
                    chunk: string,
                    index: number,
                ): VectorDocumentDto => ({
                    title:
                        `${dto.fileName} – Teil ${index + 1}`,

                    content:
                    chunk,

                    category:
                        'uploaded-document',

                    source:
                    dto.fileName,

                    chunkIndex:
                    index,

                    documentName:
                    dto.fileName,

                    chunkText:
                    chunk,
                }),
            );

        // 4. Embeddings über bestehenden Service erzeugen
        const embeddings =
            await this.embeddingsService
                .createEmbeddings({
                    texts:
                    chunks,
                });

        // 5. Text, Payload und Embeddings in Qdrant speichern
        return this.vectorStorageService
            .saveDocumentsWithEmbeddings(
                {
                    documents,
                },
                embeddings,
            );
    }
}