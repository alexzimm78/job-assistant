import { ApiProperty } from '@nestjs/swagger';

export class ChatSearchResultDto {
    @ApiProperty({
        description:
            'Gefundener relevanter Textabschnitt',
        example:
            'Für eine Bewerbung werden ein Lebenslauf und ein Anschreiben benötigt.',
    })
    chunk: string;

    @ApiProperty({
        description:
            'Ähnlichkeitswert des Suchergebnisses',
        example: 0.91,
    })
    score: number;
}