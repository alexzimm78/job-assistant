import { UnsupportedFileFormatException } from '../exceptions/unsupported-file-format.exception';
import { ExtractedDocument } from '../interfaces/extracted-document.interface';

import { DocxExtractor } from './docx.extractor';
import { MultiformatExtractor } from './multiformat.extractor';
import { PdfExtractor } from './pdf.extractor';
import { TxtExtractor } from './txt.extractor';

describe('MultiformatExtractor', () => {
  const content = Buffer.from('Testinhalt');

  const txtExtractor = {
    extract: jest.fn().mockResolvedValue('TXT'),
  } as unknown as TxtExtractor;

  const pdfExtractor = {
    extract: jest.fn().mockImplementation(
        async (
            _content: Buffer,
            documentName: string,
        ): Promise<ExtractedDocument[]> => [
          {
            content: 'PDF',
            source: {
              documentName,
              pageNumber: 2,
            },
          },
        ],
    ),
  } as unknown as PdfExtractor;

  const docxExtractor = {
    extract: jest.fn().mockResolvedValue('DOCX'),
  } as unknown as DocxExtractor;

  let extractor: MultiformatExtractor;

  beforeEach(() => {
    jest.clearAllMocks();

    extractor = new MultiformatExtractor(
        txtExtractor,
        pdfExtractor,
        docxExtractor,
    );
  });

  it('soll für TXT Text und Dokumentname zurückgeben', async () => {
    await expect(
        extractor.extract(content, 'wissen.txt'),
    ).resolves.toEqual([
      {
        content: 'TXT',
        source: {
          documentName: 'wissen.txt',
        },
      },
    ]);
  });

  it('soll für PDF Text, Dokumentname und Seite zurückgeben', async () => {
    await expect(
        extractor.extract(content, 'wissen.PDF'),
    ).resolves.toEqual([
      {
        content: 'PDF',
        source: {
          documentName: 'wissen.PDF',
          pageNumber: 2,
        },
      },
    ]);
  });

  it('soll für DOCX Text und Dokumentname zurückgeben', async () => {
    await expect(
        extractor.extract(content, 'wissen.docx'),
    ).resolves.toEqual([
      {
        content: 'DOCX',
        source: {
          documentName: 'wissen.docx',
        },
      },
    ]);
  });

  it('soll ein nicht unterstütztes Format ablehnen', async () => {
    await expect(
        extractor.extract(content, 'bild.png'),
    ).rejects.toBeInstanceOf(
        UnsupportedFileFormatException,
    );
  });
});