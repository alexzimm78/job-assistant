import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { PDFParse } from 'pdf-parse';

import { ExtractedDocument } from '../interfaces/extracted-document.interface';

@Injectable()
export class PdfExtractor {
  async extract(
      content: Buffer,
      documentName: string,
  ): Promise<ExtractedDocument[]> {
    if (content.length === 0) {
      throw new BadRequestException(
          'Die PDF-Datei darf nicht leer sein.',
      );
    }

    const parser = new PDFParse({
      data: content,
    });

    try {
      const result = await parser.getText();

      const pages: ExtractedDocument[] = result.pages
          .filter((page) => page.text.trim().length > 0)
          .map(
              (page): ExtractedDocument => ({
                content: page.text,
                source: {
                  documentName,
                  pageNumber: page.num,
                },
              }),
          );

      if (pages.length === 0) {
        throw new BadRequestException(
            'Die PDF-Datei enthält keinen auslesbaren Text.',
        );
      }

      return pages;
    } finally {
      await parser.destroy();
    }
  }
}