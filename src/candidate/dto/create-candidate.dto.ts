import { ApiProperty } from '@nestjs/swagger';
import { GermanPhoneConstraint } from '../../common/validators/german-phone.constraint';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Validate
} from 'class-validator';

export class CreateCandidateDto {
    @ApiProperty({
        example: 'Alexander Zimmermann',
        description: 'Vollständiger Name des Kandidaten',
    })
    @IsString({ message: 'Der vollständige Name muss ein Text sein' })
    @IsNotEmpty({ message: 'Der vollständige Name darf nicht leer sein' })
    @MinLength(3, {
        message: 'Der vollständige Name muss mindestens 3 Zeichen enthalten',
    })
    fullName: string;

    @ApiProperty({
        example: 'alex@example.com',
        description: 'E-Mail-Adresse des Kandidaten',
    })
    @IsEmail({}, { message: 'Die E-Mail-Adresse ist ungültig' })
    @IsNotEmpty({ message: 'Die E-Mail-Adresse darf nicht leer sein' })
    email: string;

    @ApiProperty({
        example: '+49 170 1234567',
        description: 'Telefonnummer des Kandidaten',
    })
    @IsString({ message: 'Die Telefonnummer muss ein Text sein' })
    @IsNotEmpty({ message: 'Die Telefonnummer darf nicht leer sein' })
    @Validate(GermanPhoneConstraint)
    phone: string;

    @ApiProperty({
        example: 'Berlin',
        description: 'Wohnort des Kandidaten',
    })
    @IsString({ message: 'Der Wohnort muss ein Text sein' })
    @IsNotEmpty({ message: 'Der Wohnort darf nicht leer sein' })
    @MinLength(2, {
        message: 'Der Wohnort muss mindestens 2 Zeichen enthalten',
    })
    city: string;
}