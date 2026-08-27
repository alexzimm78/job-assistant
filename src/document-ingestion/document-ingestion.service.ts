import { Injectable } from '@nestjs/common';

import { VectorDocumentDto } from '../vector-storage/dto/vector-document.dto';
import { VectorStorageService } from '../vector-storage/vector-storage.service';

import { ChunkingService } from './chunking.service';
import { IngestDocumentRequestDto } from './dto/ingest-document-request.dto';
import { TextExtractorService } from './text-extractor.service';

@Injectable()
export class DocumentIngestionService {
    constructor(
        private readonly chunkingService:
        ChunkingService,

        private readonly vectorStorageService:
        VectorStorageService,

        private readonly textExtractorService:
        TextExtractorService,
    ) {}

    // --------------------------------------------------
    // DATEI ÜBER DATEIPFAD EINLESEN
    // --------------------------------------------------

    async ingestFile(
        filePath: string,
    ): Promise<number> {
        const text =
            await this.textExtractorService
                .extractText(filePath);

        const fileName =
            filePath
                .split(/[\\/]/)
                .pop()
            ?? 'unknown-file';

        const dto: IngestDocumentRequestDto = {
            fileName,
            text,
            chunkSize: 1000,
            chunkOverlap: 200,
        };

        return this.ingestDocument(dto);
    }

    // --------------------------------------------------
    // DIREKT HOCHGELADENE DATEI VERARBEITEN
    // --------------------------------------------------

    async ingestUploadedFile(
        file: Express.Multer.File,
    ): Promise<number> {
        const text =
            await this.textExtractorService
                .extractTextFromBuffer(
                    file.buffer,
                    file.originalname,
                );

        const dto: IngestDocumentRequestDto = {
            fileName: file.originalname,
            text,
            chunkSize: 1000,
            chunkOverlap: 200,
        };

        return this.ingestDocument(dto);
    }

    // --------------------------------------------------
    // TEXT CHUNKEN UND IN QDRANT SPEICHERN
    // --------------------------------------------------

    async ingestDocument(
        dto: IngestDocumentRequestDto,
    ): Promise<number> {
        const chunkSize =
            dto.chunkSize ?? 1000;

        const chunkOverlap =
            dto.chunkOverlap ?? 200;

        const chunks =
            this.chunkingService.splitText(
                dto.text,
                chunkSize,
                chunkOverlap,
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
                        'document-chunk',

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