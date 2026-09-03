import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class TxtExtractor {
  extract(content: Buffer): string {
    const text = content.toString('utf-8');

    if (!text.trim()) {
      throw new BadRequestException('Die TXT-Datei darf nicht leer sein.');
    }

    return text;
  }
}
