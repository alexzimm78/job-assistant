import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class SearchVectorDocumentsRequestDto {
    @ApiProperty({
        description: 'Text, nach dem semantisch gesucht wird',
        example:
            'Welche Kenntnisse braucht ein Backend-Entwickler?',
    })
    @IsString()
    @IsNotEmpty()
    query: string;

    @ApiProperty({
        description: 'Maximale Anzahl der Suchergebnisse',
        example: 5,
        default: 5,
        minimum: 1,
        maximum: 20,
        required: false,
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    limit: number = 5;
}
