import { ApiProperty } from '@nestjs/swagger';

export class AskAiResponseDto {
    @ApiProperty({
        example:
            'NestJS ist ein Framework zur Entwicklung serverseitiger Anwendungen.',
        description:
            'Vom KI-Modell generierte Antwort',
    })
    answer: string;
}