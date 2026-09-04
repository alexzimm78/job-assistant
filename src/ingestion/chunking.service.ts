import {BadRequestException, Injectable} from '@nestjs/common';

import {DocumentChunk} from './interfaces/document-chunk.interface';
import {ExtractedDocument} from './interfaces/extracted-document.interface';

@Injectable()
export class ChunkingService {
    /*
     * Gewählte Strategie:
     * Fixed-Size-Chunking mit maximal 20 Prozent Overlap.
     *
     * Die Anwendung verarbeitet hauptsächlich Lebensläufe,
     * Stellenanzeigen, Anschreiben sowie Kunden- und
     * Projektdokumente. Diese Dokumente besitzen unterschiedlich
     * lange Abschnitte und enthalten häufig zusammenhängenden Text.
     *
     * Eine feste Chunk-Größe erzeugt vorhersehbar große Abschnitte.
     * Der Overlap erhält Kontext an den Chunk-Grenzen.
     *
     * Der Overlap wird auf maximal 20 Prozent begrenzt, damit
     * Kontext erhalten bleibt, ohne übermäßige Textduplizierung,
     * unnötige Embeddings und zusätzlichen Speicherverbrauch
     * in Qdrant zu verursachen.
     */
    getChunks(text: string, chunkSize = 1000, overlap = 200): string[] {
        const cleanedText = text.trim();

        if (!cleanedText) {
            throw new BadRequestException('Der Text darf nicht leer sein.');
        }

        if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
            throw new BadRequestException(
                'Die Chunk-Größe muss eine positive ganze Zahl sein.',
            );
        }

        if (!Number.isInteger(overlap) || overlap < 0) {
            throw new BadRequestException(
                'Der Overlap muss eine nicht negative ganze Zahl sein.',
            );
        }

        if (overlap >= chunkSize) {
            throw new BadRequestException(
                'Der Overlap muss kleiner als die Chunk-Größe sein.',
            );
        }

        const maxOverlap = Math.floor(chunkSize * 0.2);

        if (overlap > maxOverlap) {
            throw new BadRequestException(
                'Der Overlap darf maximal 20 Prozent der Chunk-Größe betragen.',
            );
        }

        const chunks: string[] = [];

        // Bei 1000/200 beträgt die Schrittweite 800 Zeichen.
        const step = chunkSize - overlap;

        for (let start = 0; start < cleanedText.length; start += step) {
            const end = start + chunkSize;

            const chunk = cleanedText.slice(start, end).trim();

            if (chunk.length > 0) {
                chunks.push(chunk);
            }

            /*
             * Verhindert einen zusätzlichen, fast vollständig
             * duplizierten Chunk am Dokumentende.
             */
            if (end >= cleanedText.length) {
                break;
            }
        }

        return chunks;
    }

    getDocumentChunks(
        document: ExtractedDocument,
        chunkSize = 1000,
        overlap = 200,
    ): DocumentChunk[] {
        const textChunks = this.getChunks(
            document.content,
            chunkSize,
            overlap,
        );

        return textChunks.map(
            (content): DocumentChunk => ({
                content,
                source: {
                    ...document.source,
                },
            }),
        );
    }
}
