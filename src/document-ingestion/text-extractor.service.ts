import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

import * as mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

@Injectable()
export class TextExtractorService {

    // --------------------------------------------------
    // DATEI ÜBER DATEIPFAD VERARBEITEN
    // --------------------------------------------------

    async extractText(
        filePath: string,
    ): Promise<string> {
        const extension =
            path.extname(filePath)
                .toLowerCase();

        switch (extension) {
            case '.txt':
                return this.extractTxt(
                    filePath,
                );

            case '.pdf':
                return this.extractPdf(
                    filePath,
                );

            case '.docx':
                return this.extractDocx(
                    filePath,
                );

            default:
                throw new Error(
                    `Nicht unterstütztes Dateiformat: ${extension}`,
                );
        }
    }

    // --------------------------------------------------
    // HOCHGELADENE DATEI DIREKT AUS BUFFER VERARBEITEN
    // --------------------------------------------------

    async extractTextFromBuffer(
        buffer: Buffer,
        fileName: string,
    ): Promise<string> {
        const extension =
            path.extname(fileName)
                .toLowerCase();

        switch (extension) {
            case '.txt':
                return this.extractTxtFromBuffer(
                    buffer,
                );

            case '.pdf':
                return this.extractPdfFromBuffer(
                    buffer,
                );

            case '.docx':
                return this.extractDocxFromBuffer(
                    buffer,
                );

            default:
                throw new Error(
                    `Nicht unterstütztes Dateiformat: ${extension}`,
                );
        }
    }

    // --------------------------------------------------
    // TXT ÜBER DATEIPFAD
    // --------------------------------------------------

    private async extractTxt(
        filePath: string,
    ): Promise<string> {
        const content =
            await fs.readFile(
                filePath,
                'utf-8',
            );

        return content.trim();
    }

    // --------------------------------------------------
    // PDF ÜBER DATEIPFAD
    // --------------------------------------------------

    private async extractPdf(
        filePath: string,
    ): Promise<string> {
        const buffer =
            await fs.readFile(
                filePath,
            );

        return this.extractPdfFromBuffer(
            buffer,
        );
    }

    // --------------------------------------------------
    // DOCX ÜBER DATEIPFAD
    // --------------------------------------------------

    private async extractDocx(
        filePath: string,
    ): Promise<string> {
        const result =
            await mammoth.extractRawText({
                path: filePath,
            });

        return result.value.trim();
    }

    // --------------------------------------------------
    // TXT AUS BUFFER
    // --------------------------------------------------

    private extractTxtFromBuffer(
        buffer: Buffer,
    ): string {
        return buffer
            .toString('utf-8')
            .trim();
    }

    // --------------------------------------------------
    // PDF AUS BUFFER
    // --------------------------------------------------

    private async extractPdfFromBuffer(
        buffer: Buffer,
    ): Promise<string> {
        const parser =
            new PDFParse({
                data: buffer,
            });

        try {
            const result =
                await parser.getText();

            return result.text.trim();

        } finally {
            await parser.destroy();
        }
    }

    // --------------------------------------------------
    // DOCX AUS BUFFER
    // --------------------------------------------------

    private async extractDocxFromBuffer(
        buffer: Buffer,
    ): Promise<string> {
        const result =
            await mammoth.extractRawText({
                buffer,
            });

        return result.value.trim();
    }
}