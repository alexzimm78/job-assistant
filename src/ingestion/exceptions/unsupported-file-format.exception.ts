import { BadRequestException } from '@nestjs/common';

export class UnsupportedFileFormatException extends BadRequestException {
  constructor(extension: string) {
    super(
      `Das Dateiformat "${extension || 'unbekannt'}" wird nicht unterstützt. Erlaubt sind .txt, .pdf und .docx.`,
    );
  }
}
