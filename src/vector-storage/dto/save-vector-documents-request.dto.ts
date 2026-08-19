import { ApiProperty } from '@nestjs/swagger';

import {
    ArrayNotEmpty,
    IsArray,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { VectorDocumentDto } from './vector-document.dto';

export class SaveVectorDocumentsRequestDto {
    @ApiProperty({
        description:
            'Dokumente, die im Vektorspeicher gespeichert werden',
        type: [VectorDocumentDto],
    })
    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({
        each: true,
    })
    @Type(() => VectorDocumentDto)
    documents: VectorDocumentDto[];
}