import { ApiProperty } from '@nestjs/swagger';

export class CreateCandidateDto {
    @ApiProperty({
        example: 'Alexander Zimmermann',
        description: 'Vollständiger Name des Kandidaten',
    })
    fullName: string;

    @ApiProperty({
        example: 'alex@example.com',
        description: 'E-Mail-Adresse des Kandidaten',
    })
    email: string;

    @ApiProperty({
        example: '+49 170 1234567',
        description: 'Telefonnummer des Kandidaten',
    })
    phone: string;

    @ApiProperty({
        example: 'Berlin',
        description: 'Wohnort des Kandidaten',
    })
    city: string;
}