import { ApiProperty } from '@nestjs/swagger';

import { ApplicationStatus } from '../enums/application-status.enum';

export class ApplicationResponseDto {
    @ApiProperty({
        example: 1,
        description: 'ID der Bewerbung',
    })
    id: number;

    @ApiProperty({
        example: 1,
        description: 'ID des Kandidaten',
    })
    candidateId: number;

    @ApiProperty({
        example: 1,
        description: 'ID des Lebenslaufs',
    })
    resumeId: number;

    @ApiProperty({
        example: 1,
        description: 'ID des Stellenangebots',
    })
    jobOfferId: number;

    @ApiProperty({
        example:
            'Sehr geehrte Damen und Herren, hiermit bewerbe ich mich auf die ausgeschriebene Stelle.',
        description: 'Bewerbungsanschreiben',
    })
    coverLetter: string;

    @ApiProperty({
        enum: ApplicationStatus,
        example: ApplicationStatus.SENT,
        description: 'Status der Bewerbung',
    })
    status: ApplicationStatus;

    @ApiProperty({
        example: '2026-07-20T10:00:00.000Z',
        description: 'Zeitpunkt, an dem die Bewerbung gesendet wurde',
        type: String,
        format: 'date-time',
    })
    sentAt: Date;
}