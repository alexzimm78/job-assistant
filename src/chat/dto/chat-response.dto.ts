import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

export class ChatSourceDto {
    @ApiProperty({
        description:
            'Name des Quelldokuments',
        example:
            'bewerbungsprozess-public.txt',
    })
    documentName: string;

    @ApiPropertyOptional({
        description:
            'Seitennummer innerhalb des Quelldokuments',
        example: 1,
    })
    pageNumber?: number;
}

export class ChatResponseDto {
    @ApiProperty({
        description:
            'Von der KI auf Grundlage der Wissensdatenbank generierte Antwort',
        example:
            'Der AI Job Assistant unterstützt Bewerber bei der Verwaltung ihrer Bewerbungen.',
    })
    answer: string;

    @ApiProperty({
        description:
            'Für die Antwort verwendete Quellen',
        type: [
            ChatSourceDto,
        ],
    })
    sources: ChatSourceDto[];
}