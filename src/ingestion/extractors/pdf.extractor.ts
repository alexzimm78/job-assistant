import { BadRequestException, Injectable } from '@nestjs/common';

import { PDFParse } from 'pdf-parse';

@Injectable()
export class PdfExtractor {
  async extract(content: Buffer): Promise<string> {
    if (content.length === 0) {
      throw new BadRequestException('Die PDF-Datei darf nicht leer sein.');
    }

    const parser = new PDFParse({
      data: content,
    });

    try {
      const result = await parser.getText();

      if (!result.text.trim()) {
        throw new BadRequestException(
          'Die PDF-Datei enthält keinen auslesbaren Text.',
        );
      }

      return result.text;
    } finally {
      await parser.destroy();
    }
  }
}
