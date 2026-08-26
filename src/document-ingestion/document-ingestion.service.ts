import {Injectable} from '@nestjs/common';

import {VectorDocumentDto} from '../vector-storage/dto/vector-document.dto';
import {VectorStorageService} from '../vector-storage/vector-storage.service';

import {IngestDocumentRequestDto} from './dto/ingest-document-request.dto';
import {ChunkingService} from './chunking.service';

@Injectable()
export class DocumentIngestionService {
    constructor(
        private readonly chunkingService:
        ChunkingService,
        private readonly vectorStorageService:
        VectorStorageService,
    ) {
    }

    async ingestDocument(
        dto: IngestDocumentRequestDto,
    ): Promise<number> {
        const chunkSize = dto.chunkSize ?? 1000;
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
                    content: chunk,
                    category: 'document-chunk',
                    source: dto.fileName,
                }),
            );

        return this.vectorStorageService
            .saveDocuments({
                documents,
            });
    }
}