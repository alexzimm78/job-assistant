import { Injectable } from '@nestjs/common';

import { VectorDocumentDto } from '../vector-storage/dto/vector-document.dto';
import { VectorStorageService } from '../vector-storage/vector-storage.service';

import { ChunkingService } from './chunking.service';
import { CleanService } from './clean.service';
import { IngestDocumentRequestDto } from './dto/ingest-document-request.dto';
import { TextExtractorService } from './text-extractor.service';

@Injectable()
export class DocumentIngestionService {
    constructor(
        private readonly chunkingService:
        ChunkingService,

        private readonly cleanService:
        CleanService,

        private readonly vectorStorageService:
        VectorStorageService,

        private readonly textExtractorService:
        TextExtractorService,
    ) {}

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
    // TEXT BEREINIGEN UND IN QDRANT SPEICHERN
    // --------------------------------------------------

    async ingestDocument(
        dto: IngestDocumentRequestDto,
    ): Promise<number> {
        const cleanedText =
            this.cleanService.cleanText(
                dto.text,
            );

        const chunks =
            this.chunkingService.getChunks(
                cleanedText,
            );

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
                }),
            );

        return this.vectorStorageService
            .saveDocuments({
                documents,
            });
    }
}