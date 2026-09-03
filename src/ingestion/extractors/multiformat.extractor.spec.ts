import { UnsupportedFileFormatException } from '../exceptions/unsupported-file-format.exception';

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
    extract: jest.fn().mockResolvedValue('PDF'),
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

  it.each([
    ['wissen.txt', 'TXT'],
    ['wissen.PDF', 'PDF'],
    ['wissen.docx', 'DOCX'],
  ])(
    'soll für %s den passenden Extractor auswählen',
    async (fileName: string, expected: string) => {
      await expect(extractor.extract(content, fileName)).resolves.toBe(
        expected,
      );
    },
  );

  it('soll ein nicht unterstütztes Format ablehnen', async () => {
    await expect(extractor.extract(content, 'bild.png')).rejects.toBeInstanceOf(
      UnsupportedFileFormatException,
    );
  });
});
