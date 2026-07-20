import { ApiProperty } from '@nestjs/swagger';

export class CandidateResponseDto {
    @ApiProperty({
        example: 1,
    })
    id: number;

    @ApiProperty({
        example: 'Alexander Zimmermann',
    })
    fullName: string;

    @ApiProperty({
        example: 'alex@example.com',
    })
    email: string;

    @ApiProperty({
        example: '+49123456789',
    })
    phone: string;

    @ApiProperty({
        example: 'Berlin',
    })
    city: string;
}