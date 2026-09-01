import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

@Injectable()
export class ChunkingService {
    getChunks(
        text: string,
    ): string[] {
        if (!text.trim()) {
            throw new BadRequestException(
                'Der Text darf nicht leer sein.',
            );
        }

        return [
            text,
        ];
    }
}