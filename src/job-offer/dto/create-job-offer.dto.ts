import { ApiProperty } from '@nestjs/swagger';
import { SalaryRangeConstraint } from '../../common/validators/salary-range.constraint';
import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
    MinLength,
    Validate
} from 'class-validator';

import { EmploymentType } from '../enums/employment-type.enum';

export class CreateJobOfferDto {
    @ApiProperty({
        example: 'OpenAI',
        description: 'Name des Unternehmens',
    })
    @IsString({ message: 'Der Unternehmensname muss ein Text sein' })
    @IsNotEmpty({ message: 'Der Unternehmensname darf nicht leer sein' })
    @MinLength(2, {
        message: 'Der Unternehmensname muss mindestens 2 Zeichen enthalten',
    })
    companyName: string;

    @ApiProperty({
        example: 'AI Engineer',
        description: 'Bezeichnung der Arbeitsstelle',
    })
    @IsString({ message: 'Die Position muss ein Text sein' })
    @IsNotEmpty({ message: 'Die Position darf nicht leer sein' })
    @MinLength(3, {
        message: 'Die Position muss mindestens 3 Zeichen enthalten',
    })
    position: string;

    @ApiProperty({
        example: 'Berlin',
        description: 'Arbeitsort',
    })
    @IsString({ message: 'Der Arbeitsort muss ein Text sein' })
    @IsNotEmpty({ message: 'Der Arbeitsort darf nicht leer sein' })
    @MinLength(2, {
        message: 'Der Arbeitsort muss mindestens 2 Zeichen enthalten',
    })
    city: string;

    @ApiProperty({
        example: 50000,
        description: 'Minimales Jahresgehalt',
    })
    @Type(() => Number)
    @IsInt({ message: 'Das Mindestgehalt muss eine ganze Zahl sein' })
    @Min(1, { message: 'Das Mindestgehalt muss größer als 0 sein' })
    salaryFrom: number;

    @ApiProperty({
        example: 70000,
        description: 'Maximales Jahresgehalt',
    })
    @Type(() => Number)
    @IsInt({ message: 'Das Maximalgehalt muss eine ganze Zahl sein' })
    @Min(1, { message: 'Das Maximalgehalt muss größer als 0 sein' })
    @ApiProperty({
        example: 70000,
        description: 'Maximales Jahresgehalt',
    })
    @Type(() => Number)
    @IsInt({ message: 'Das Maximalgehalt muss eine ganze Zahl sein' })
    @Min(1, { message: 'Das Maximalgehalt muss größer als 0 sein' })
    @Validate(SalaryRangeConstraint)
    salaryTo: number;


    @ApiProperty({
        enum: EmploymentType,
        example: EmploymentType.FULL_TIME,
        description: 'Beschäftigungsart',
    })
    @IsEnum(EmploymentType, {
        message: 'Die Beschäftigungsart ist ungültig',
    })
    employmentType: EmploymentType;
}