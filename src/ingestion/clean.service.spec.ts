import { CleanService } from './clean.service';

describe('CleanService', () => {
  let service: CleanService;

  beforeEach(() => {
    service = new CleanService();
  });

  it('soll Seitenzahlen, Trennlinien, Copyright und Wiederholungen entfernen', () => {
    const rawText = `
                    Seite 1
                    ────────────────────
                    AlexZ Job Assistant
                    Bewerbungen werden sicher verarbeitet.
                    © AlexZ Automation

                    Seite 2
                    ────────────────────
                    AlexZ Job Assistant
                    Der nützliche Inhalt bleibt erhalten.
                `;

    const cleanedText = service.cleanText(rawText);

    expect(cleanedText).not.toMatch(/Seite\s+[12]/);
    expect(cleanedText).not.toContain('────');
    expect(cleanedText).not.toContain('©');
    expect(cleanedText.match(/AlexZ Job Assistant/g)).toHaveLength(1);
    expect(cleanedText).toContain('Bewerbungen werden sicher verarbeitet.');
    expect(cleanedText).toContain('Der nützliche Inhalt bleibt erhalten.');
  });
});
