import {Injectable} from '@nestjs/common';

import * as path from 'path';

import {UnsupportedFileFormatException} from '../exceptions/unsupported-file-format.exception';
import {ExtractedDocument} from '../interfaces/extracted-document.interface';

import {DocxExtractor} from './docx.extractor';
import {PdfExtractor} from './pdf.extractor';
import {TxtExtractor} from './txt.extractor';

@Injectable()
export class MultiformatExtractor {
    constructor(
        private readonly txtExtractor: TxtExtractor,
        private readonly pdfExtractor: PdfExtractor,
        private readonly docxExtractor: DocxExtractor,
    ) {
    }

    async extract(
        content: Buffer,
        fileName: string,
    ): Promise<ExtractedDocument[]> {
        const extension = path.extname(fileName).toLowerCase();

        switch (extension) {
            case '.txt': {
                const text =
                    await this.txtExtractor.extract(content);

                return [
                    {
                        content: text,
                        source: {
                            documentName: fileName,
                        },
                    },
                ];
            }

            case '.pdf':
                return this.pdfExtractor.extract(
                    content,
                    fileName,
                );

            case '.docx': {
                const text = await this.docxExtractor.extract(content);

                return [
                    {
                        content: text,
                        source: {
                            documentName: fileName,
                        },
                    },
                ];
            }

            default:
                throw new UnsupportedFileFormatException(extension);
        }
    }
}