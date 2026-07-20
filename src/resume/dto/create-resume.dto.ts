import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    MinLength,
} from 'class-validator';

export class CreateResumeDto {
    @ApiProperty({
        example: 1,
        description: 'ID des Kandidaten',
    })
    @Type(() => Number)
    @IsInt({ message: 'Die Kandidaten-ID muss eine ganze Zahl sein' })
    @Min(1, { message: 'Die Kandidaten-ID muss mindestens 1 sein' })
    candidateId: number;

    @ApiProperty({
        example: 'AI Engineer Resume',
        description: 'Titel des Lebenslaufs',
    })
    @IsString({ message: 'Der Titel muss ein Text sein' })
    @IsNotEmpty({ message: 'Der Titel darf nicht leer sein' })
    @MinLength(3, {
        message: 'Der Titel muss mindestens 3 Zeichen enthalten',
    })
    title: string;

    @ApiProperty({
        example: ['TypeScript', 'NestJS', 'PostgreSQL'],
        type: [String],
        description: 'Kenntnisse des Kandidaten',
    })
    @IsArray({ message: 'Die Kenntnisse müssen als Array angegeben werden' })
    @ArrayMinSize(1, {
        message: 'Mindestens eine Kenntnis muss angegeben werden',
    })
    @IsString({
        each: true,
        message: 'Jede Kenntnis muss ein Text sein',
    })
    @IsNotEmpty({
        each: true,
        message: 'Eine Kenntnis darf nicht leer sein',
    })
    skills: string[];

    @ApiProperty({
        example: '2 years',
        description: 'Berufserfahrung des Kandidaten',
    })
    @IsString({ message: 'Die Berufserfahrung muss ein Text sein' })
    @IsNotEmpty({ message: 'Die Berufserfahrung darf nicht leer sein' })
    @MinLength(2, {
        message: 'Die Berufserfahrung muss mindestens 2 Zeichen enthalten',
    })
    experience: string;
}