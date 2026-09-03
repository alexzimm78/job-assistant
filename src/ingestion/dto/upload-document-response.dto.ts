import { ApiProperty } from '@nestjs/swagger';

export class UploadDocumentResponseDto {
  @ApiProperty({
    description: 'Anzahl der erstellten Dokument-Chunks',
    example: 1,
  })
  chunksCreated: number;
}
