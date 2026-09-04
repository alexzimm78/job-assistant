import {BadRequestException} from '@nestjs/common';

import {ChunkingService} from './chunking.service';

describe('ChunkingService', () => {
    let service: ChunkingService;

    beforeEach(() => {
        service = new ChunkingService();
    });

    it('soll einen kurzen Lebenslauf als einen Chunk zurückgeben', () => {
        const text =
            'Berufserfahrung: Logistik. Kenntnisse: NestJS und TypeScript.';

        const chunks = service.getChunks(text, 1000, 200);

        expect(chunks).toEqual([text]);
    });

    it('soll eine lange Stellenanzeige in mehrere Chunks aufteilen', () => {
        const text = 'Aufgaben und Anforderungen der Stellenanzeige. '.repeat(60);

        const chunks = service.getChunks(text, 1000, 200);

        expect(chunks.length).toBeGreaterThan(1);

        for (const chunk of chunks) {
            expect(chunk.length).toBeLessThanOrEqual(1000);
        }
    });

    it('soll den Kontext durch Overlap erhalten', () => {
        const text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const chunks = service.getChunks(text, 10, 2);

        expect(chunks).toEqual(['ABCDEFGHIJ', 'IJKLMNOPQR', 'QRSTUVWXYZ']);

        expect(chunks[0].slice(-2)).toBe(chunks[1].slice(0, 2));

        expect(chunks[1].slice(-2)).toBe(chunks[2].slice(0, 2));
    });

    it('soll ein strukturiertes Anschreiben verarbeiten', () => {
        const text = [
            'Sehr geehrte Damen und Herren,',
            '',
            'hiermit bewerbe ich mich als Mitarbeiter im IT-Support.',
            '',
            'Ich verfüge über Erfahrung in Logistik und AI Engineering.',
            '',
            'Mit freundlichen Grüßen',
        ].join('\n');

        const chunks = service.getChunks(text, 1000, 200);

        expect(chunks).toHaveLength(1);

        expect(chunks[0]).toContain('IT-Support');

        expect(chunks[0]).toContain('AI Engineering');
    });

    it('soll bei leerem Text einen Fehler auslösen', () => {
        expect(() => service.getChunks('   ')).toThrow(BadRequestException);
    });

    it('soll eine Chunk-Größe kleiner oder gleich 0 ablehnen', () => {
        expect(() => service.getChunks('Testtext', 0, 0)).toThrow(
            BadRequestException,
        );
    });

    it('soll einen negativen Overlap ablehnen', () => {
        expect(() => service.getChunks('Testtext', 1000, -1)).toThrow(
            BadRequestException,
        );
    });

    it('soll einen Overlap ablehnen, der nicht kleiner als die Chunk-Größe ist', () => {
        expect(() => service.getChunks('Testtext', 1000, 1000)).toThrow(
            BadRequestException,
        );
    });

    it('soll eine nicht numerische Chunk-Größe ablehnen', () => {
        expect(() => service.getChunks('Testtext', Number('abc'), 200)).toThrow(
            BadRequestException,
        );
    });

    it('soll Dezimalzahlen als Parameter ablehnen', () => {
        expect(() => service.getChunks('Testtext', 1000.5, 200.5)).toThrow(
            BadRequestException,
        );
    });

    it('soll einen Overlap über 20 Prozent ablehnen', () => {
        expect(() => service.getChunks('Testtext', 1000, 201)).toThrow(
            BadRequestException,
        );
    });

    it('soll die PDF-Quelle an alle Chunks weitergeben', () => {
        const document = {
            content: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            source: {
                documentName: 'lebenslauf.pdf',
                pageNumber: 3,
            },
        };

        const chunks = service.getDocumentChunks(
            document,
            10,
            2,
        );

        expect(chunks).toHaveLength(3);

        for (const chunk of chunks) {
            expect(chunk.source).toEqual({
                documentName: 'lebenslauf.pdf',
                pageNumber: 3,
            });
        }

        expect(chunks.map((chunk) => chunk.content)).toEqual([
            'ABCDEFGHIJ',
            'IJKLMNOPQR',
            'QRSTUVWXYZ',
        ]);
    });
});
