import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanService {
  // --------------------------------------------------
  // TEXT BEREINIGEN
  // --------------------------------------------------

  cleanText(text: string): string {
    const normalizedText = text
      // Zeilenumbrüche vereinheitlichen
      .replace(/\r\n?/g, '\n')

      // Tabs durch Leerzeichen ersetzen
      .replace(/\t/g, ' ')

      // Seitennummern auf Deutsch, Englisch und Russisch entfernen
      .replace(/^\s*(?:seite|page|страница)\s+\d+\s*$/gimu, '')

      // Horizontale Trennlinien entfernen
      .replace(/^\s*[-_=─—]{3,}\s*$/gmu, '')

      // Copyright-Zeilen entfernen
      .replace(/^\s*(?:©|copyright\b).*$/gimu, '')

      // Mehrere Leerzeichen innerhalb einer Zeile reduzieren
      .replace(/[ ]{2,}/g, ' ')

      // Leerzeichen vor Zeilenumbrüchen entfernen
      .replace(/[ ]+\n/g, '\n')

      .trim();

    const seenServiceLines = new Set<string>();

    const uniqueLines = normalizedText
      .split('\n')
      .filter((line: string): boolean => {
        const normalizedLine = line.trim().toLowerCase();

        if (!normalizedLine) {
          return true;
        }

        const isShortServiceLine = normalizedLine.length <= 80;

        if (isShortServiceLine && seenServiceLines.has(normalizedLine)) {
          return false;
        }

        if (isShortServiceLine) {
          seenServiceLines.add(normalizedLine);
        }

        return true;
      });

    return uniqueLines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}
