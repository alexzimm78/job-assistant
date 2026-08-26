import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ChunkingService {
    splitText(
        text: string,
        chunkSize = 1000,
        chunkOverlap = 200,
    ): string[] {
        const normalizedText = text
            .replace(/\r\n/g, '\n')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        if (!normalizedText) {
            throw new BadRequestException(
                'Der Text darf nicht leer sein.',
            );
        }

        if (chunkSize <= 0) {
            throw new BadRequestException(
                'Die Chunk-Größe muss größer als 0 sein.',
            );
        }

        if (
            chunkOverlap < 0 ||
            chunkOverlap >= chunkSize
        ) {
            throw new BadRequestException(
                'Die Überlappung muss mindestens 0 und kleiner als die Chunk-Größe sein.',
            );
        }

        const chunks: string[] = [];
        const step = chunkSize - chunkOverlap;

        for (
            let start = 0;
            start < normalizedText.length;
            start += step
        ) {
            const chunk = normalizedText
                .slice(start, start + chunkSize)
                .trim();

            if (chunk) {
                chunks.push(chunk);
            }

            if (
                start + chunkSize >=
                normalizedText.length
            ) {
                break;
            }
        }

        return chunks;
    }
}