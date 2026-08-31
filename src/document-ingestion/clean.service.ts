import { Injectable } from '@nestjs/common';

@Injectable()
export class CleanService {

    // --------------------------------------------------
    // TEXT BEREINIGEN
    // --------------------------------------------------

    cleanText(
        text: string,
    ): string {
        return text
            // Zeilenumbrüche vereinheitlichen
            .replace(/\r\n?/g, '\n')

            // Tabs durch Leerzeichen ersetzen
            .replace(/\t/g, ' ')

            // Mehrere Leerzeichen entfernen
            .replace(/[ ]{2,}/g, ' ')

            // Leerzeichen vor Zeilenumbrüchen entfernen
            .replace(/[ ]+\n/g, '\n')

            // Mehr als zwei Zeilenumbrüche reduzieren
            .replace(/\n{3,}/g, '\n\n')

            // Leerzeichen am Anfang und Ende entfernen
            .trim();
    }
}