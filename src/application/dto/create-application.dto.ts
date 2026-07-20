import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsDateString,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

import { ApplicationStatus } from '../enums/application-status.enum';

export class CreateApplicationDto {
    @ApiProperty({
        example: 1,
        description: 'ID des Kandidaten',
    })
    @Type(() => Number)
    @IsInt({ message: 'Die Kandidaten-ID muss eine ganze Zahl sein' })
    @Min(1, { message: 'Die Kandidaten-ID muss mindestens 1 sein' })
    candidateId: number;

    @ApiProperty({
        example: 1,
        description: 'ID des Lebenslaufs',
    })
    @Type(() => Number)
    @IsInt({ message: 'Die Lebenslauf-ID muss eine ganze Zahl sein' })
    @Min(1, { message: 'Die Lebenslauf-ID muss mindestens 1 sein' })
    resumeId: number;

    @ApiProperty({
        example: 1,
        description: 'ID des Stellenangebots',
    })
    @Type(() => Number)
    @IsInt({ message: 'Die Stellenangebots-ID muss eine ganze Zahl sein' })
    @Min(1, { message: 'Die Stellenangebots-ID muss mindestens 1 sein' })
    jobOfferId: number;

    @ApiProperty({
        example:
            'Sehr geehrte Damen und Herren, hiermit bewerbe ich mich auf die ausgeschriebene Stelle.',
        description: 'Bewerbungsanschreiben',
    })
    @IsString({ message: 'Das Bewerbungsanschreiben muss ein Text sein' })
    @IsNotEmpty({
        message: 'Das Bewerbungsanschreiben darf nicht leer sein',
    })
    @MinLength(20, {
        message:
            'Das Bewerbungsanschreiben muss mindestens 20 Zeichen enthalten',
    })
    coverLetter: string;

    @ApiProperty({
        enum: ApplicationStatus,
        example: ApplicationStatus.SENT,
        description: 'Status der Bewerbung',
    })
    @IsEnum(ApplicationStatus, {
        message: 'Der Bewerbungsstatus ist ungültig',
    })
    status: ApplicationStatus;

    @ApiProperty({
        example: '2026-07-20T10:00:00.000Z',
        description: 'Zeitpunkt, an dem die Bewerbung gesendet wurde',
        type: String,
        format: 'date-time',
    })
    @IsDateString(
        {},
        {
            message:
                'Das Versanddatum muss ein gültiges ISO-Datum sein',
        },
    )
    sentAt: string;
}