import { ApiProperty } from '@nestjs/swagger';

import { EmploymentType } from '../enums/employment-type.enum';

export class CreateJobOfferDto {
    @ApiProperty({
        example: 'OpenAI',
        description: 'Name des Unternehmens',
    })
    companyName: string;

    @ApiProperty({
        example: 'AI Engineer',
        description: 'Bezeichnung der Arbeitsstelle',
    })
    position: string;

    @ApiProperty({
        example: 'Berlin',
        description: 'Arbeitsort',
    })
    city: string;

    @ApiProperty({
        example: 50000,
        description: 'Minimales Jahresgehalt',
    })
    salaryFrom: number;

    @ApiProperty({
        example: 70000,
        description: 'Maximales Jahresgehalt',
    })
    salaryTo: number;

    @ApiProperty({
        enum: EmploymentType,
        example: EmploymentType.FULL_TIME,
        description: 'Beschäftigungsart',
    })
    employmentType: EmploymentType;
}