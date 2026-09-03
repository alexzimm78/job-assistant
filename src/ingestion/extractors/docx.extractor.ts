import { BadRequestException, Injectable } from '@nestjs/common';

import * as mammoth from 'mammoth';

@Injectable()
export class DocxExtractor {
  async extract(content: Buffer): Promise<string> {
    if (content.length === 0) {
      throw new BadRequestException('Die DOCX-Datei darf nicht leer sein.');
    }

    const result = await mammoth.extractRawText({
      buffer: content,
    });

    if (!result.value.trim()) {
      throw new BadRequestException(
        'Die DOCX-Datei enthält keinen auslesbaren Text.',
      );
    }

    return result.value;
  }
}
