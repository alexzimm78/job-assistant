import {
    ApiProperty,
} from '@nestjs/swagger';

export class ChatResponseDto {
    @ApiProperty({
        description:
            'Von der KI auf Grundlage der Wissensdatenbank generierte Antwort',
        example:
            'Der AI Job Assistant unterstützt Bewerber bei der Verwaltung ihrer Bewerbungen.',
    })
    answer: string;
}