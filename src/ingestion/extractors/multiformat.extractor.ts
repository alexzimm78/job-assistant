import { Injectable } from '@nestjs/common';

import * as path from 'path';

import { UnsupportedFileFormatException } from '../exceptions/unsupported-file-format.exception';

import { DocxExtractor } from './docx.extractor';
import { PdfExtractor } from './pdf.extractor';
import { TxtExtractor } from './txt.extractor';

@Injectable()
export class MultiformatExtractor {
  constructor(
    private readonly txtExtractor: TxtExtractor,
    private readonly pdfExtractor: PdfExtractor,
    private readonly docxExtractor: DocxExtractor,
  ) {}

  async extract(content: Buffer, fileName: string): Promise<string> {
    const extension = path.extname(fileName).toLowerCase();

    switch (extension) {
      case '.txt':
        return this.txtExtractor.extract(content);

      case '.pdf':
        return this.pdfExtractor.extract(content);

      case '.docx':
        return this.docxExtractor.extract(content);

      default:
        throw new UnsupportedFileFormatException(extension);
    }
  }
}
