import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class ChunkingService {
    getChunks(
        text: string,
        chunkSize = 1000,
        overlap = 200,
    ): string[] {
        const cleanedText = text.trim();

        if (!cleanedText) {
            throw new BadRequestException(
                'Der Text darf nicht leer sein.',
            );
        }

        if (
            !Number.isInteger(chunkSize) ||
            chunkSize <= 0
        ) {
            throw new BadRequestException(
                'Die Chunk-Größe muss eine positive ganze Zahl sein.',
            );
        }

        if (
            !Number.isInteger(overlap) ||
            overlap < 0
        ) {
            throw new BadRequestException(
                'Der Overlap muss eine nicht negative ganze Zahl sein.',
            );
        }

        if (overlap >= chunkSize) {
            throw new BadRequestException(
                'Der Overlap muss kleiner als die Chunk-Größe sein.',
            );
        }

        const chunks: string[] = [];
        const step = chunkSize - overlap;

        for (
            let start = 0;
            start < cleanedText.length;
            start += step
        ) {
            const end = start + chunkSize;

            const chunk = cleanedText
                .slice(start, end)
                .trim();

            if (chunk.length > 0) {
                chunks.push(chunk);
            }

            if (end >= cleanedText.length) {
                break;
            }
        }

        return chunks;
    }
}