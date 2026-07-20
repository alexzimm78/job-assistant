import { ApiProperty } from '@nestjs/swagger';

export class ResumeResponseDto {
    @ApiProperty({
        example: 1,
        description: 'ID des Lebenslaufs',
    })
    id: number;

    @ApiProperty({
        example: 1,
        description: 'ID des Kandidaten',
    })
    candidateId: number;

    @ApiProperty({
        example: 'AI Engineer Resume',
        description: 'Titel des Lebenslaufs',
    })
    title: string;

    @ApiProperty({
        example: ['TypeScript', 'NestJS', 'PostgreSQL'],
        type: [String],
        description: 'Kenntnisse des Kandidaten',
    })
    skills: string[];

    @ApiProperty({
        example: '2 years',
        description: 'Berufserfahrung des Kandidaten',
    })
    experience: string;
}