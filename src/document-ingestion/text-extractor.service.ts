import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import * as fs from 'fs/promises';
import * as path from 'path';

import { TxtExtractor } from './extractors/txt.extractor';

@Injectable()
export class TextExtractorService {
    constructor(
        private readonly txtExtractor:
        TxtExtractor,
    ) {}

    // --------------------------------------------------
    // TXT-DATEI ÜBER DATEIPFAD EINLESEN
    // --------------------------------------------------

    async extractText(
        filePath: string,
    ): Promise<string> {
        this.validateTxtFile(
            filePath,
        );

        const buffer =
            await fs.readFile(
                filePath,
            );

        return this.txtExtractor.extract(
            buffer,
        );
    }

    // --------------------------------------------------
    // HOCHGELADENE TXT-DATEI AUS BUFFER EINLESEN
    // --------------------------------------------------

    extractTextFromBuffer(
        buffer: Buffer,
        fileName: string,
    ): string {
        this.validateTxtFile(
            fileName,
        );

        return this.txtExtractor.extract(
            buffer,
        );
    }

    // --------------------------------------------------
    // DATEIFORMAT PRÜFEN
    // --------------------------------------------------

    private validateTxtFile(
        fileName: string,
    ): void {
        const extension =
            path.extname(
                fileName,
            ).toLowerCase();

        if (extension !== '.txt') {
            throw new BadRequestException(
                'Es werden ausschließlich TXT-Dateien unterstützt.',
            );
        }
    }
}