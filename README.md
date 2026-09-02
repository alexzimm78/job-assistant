# AI Job Assistant

NestJS-Backend für einen AI-Bewerbungsassistenten. Die Anwendung verarbeitet Bewerbungsdokumente, erzeugt Embeddings und
speichert Textabschnitte als Vektoren in Qdrant.

## Document Ingestion Pipeline

Die Pipeline verarbeitet hochgeladene `.txt`-Dokumente:

```text
TXT-Datei
    ↓
TextExtractorService
    ↓
CleanService
    ↓
ChunkingService
    ↓
EmbeddingsService
    ↓
VectorStorageService
    ↓
Qdrant
```

Der `IngestionService` koordiniert den Ablauf. Die Verantwortlichkeiten bleiben getrennt:

- `TextExtractorService`: Text aus der TXT-Datei extrahieren
- `CleanService`: Text bereinigen
- `ChunkingService`: Text in Chunks aufteilen
- `EmbeddingsService`: für jeden Chunk ein Embedding erzeugen
- `VectorStorageService`: Embeddings und Metadaten in Qdrant speichern

Der `ChunkingService` greift nicht auf AI-APIs, Qdrant oder eine Datenbank zu. Seine einzige Aufgabe ist die Umwandlung
von Text in ein geordnetes `string[]`.

## Geplante Dokumenttypen

Die Pipeline verarbeitet hauptsächlich Dokumente aus dem Bewerbungsbereich:

| Dokumenttyp                  | Typische Eigenschaften                                     | Anforderung an das Chunking                                                   |
|------------------------------|------------------------------------------------------------|-------------------------------------------------------------------------------|
| Lebenslauf                   | Überschriften, Listen und unterschiedlich lange Abschnitte | Berufserfahrung, Ausbildung und Kenntnisse sollen getrennt auffindbar bleiben |
| Stellenanzeige               | Längere Aufgaben- und Anforderungsbeschreibungen           | Einzelne Anforderungen sollen gezielt gefunden werden können                  |
| Anschreiben                  | Zusammenhängender Fließtext                                | Der Zusammenhang zwischen benachbarten Aussagen soll erhalten bleiben         |
| Kunden- und Projektdokumente | Unterschiedliche Länge und Struktur                        | Das Verfahren soll vorhersehbar und robust arbeiten                           |

## Gewählte Chunking-Strategie

Als Hauptstrategie wird **Fixed-Size-Chunking mit Overlap** verwendet.

```text
chunkSize = 1000 Zeichen
overlap = 200 Zeichen
```

Eine feste Chunk-Größe erzeugt Abschnitte mit vorhersehbarer maximaler Länge. Das ist für Dokumente mit unterschiedlich
großen Absätzen sinnvoll und verhindert, dass ein langes Dokument nur durch ein einziges, zu allgemeines Embedding
repräsentiert wird.

Der Overlap übernimmt einen kleinen Teil des vorherigen Chunks in den folgenden Chunk. Dadurch bleibt Kontext erhalten,
wenn eine zusammenhängende Aussage genau an einer Chunk-Grenze liegt.

## Begrenzung der Textduplizierung

Der Overlap ist bewusst auf maximal **20 Prozent** der Chunk-Größe begrenzt:

```text
200 / 1000 = 0,20 = 20 %
```

Bei den Standardwerten beträgt die Schrittweite:

```text
step = chunkSize - overlap
step = 1000 - 200
step = 800 Zeichen
```

Somit werden nur die für den Kontext benötigten 200 Zeichen wiederholt. Ein größerer Overlap wird mit einer
`BadRequestException` abgelehnt. Das verhindert:

- übermäßige Textduplizierung;
- unnötig viele Embeddings;
- zusätzlichen Speicherverbrauch in Qdrant;
- stark redundante Suchergebnisse.

Die Schleife wird beendet, sobald das Dokumentende erreicht ist. Dadurch entsteht kein zusätzlicher, nahezu vollständig
duplizierter Schluss-Chunk.

## Konfiguration

Die Parameter können ohne Änderung des TypeScript-Codes über Umgebungsvariablen angepasst werden:

```env
DOCUMENT_CHUNK_SIZE=1000
DOCUMENT_CHUNK_OVERLAP=200
```

Wenn die Variablen fehlen, verwendet die Anwendung die Standardwerte `1000` und `200`.

Validierungsregeln:

```text
chunkSize muss eine positive ganze Zahl sein
overlap muss eine nicht negative ganze Zahl sein
overlap muss kleiner als chunkSize sein
overlap darf maximal 20 Prozent von chunkSize betragen
```

Ungültige Werte führen kontrolliert zu einer `BadRequestException`.

## Embeddings pro Chunk

Nach dem Chunking erhält der `EmbeddingsService` das vollständige Chunk-Array. Für jeden Chunk wird genau ein separates
Embedding erzeugt:

```text
8 Chunks
    ↓
8 Embeddings
    ↓
8 Qdrant-Points
```

Vor dem Speichern prüft der `VectorStorageService`, ob die Anzahl der Embeddings mit der Anzahl der Chunks
übereinstimmt. Bei einer Abweichung wird eine `InternalServerErrorException` ausgelöst. Dadurch kann kein Chunk mit
einem falschen Embedding verbunden werden.

## Speicherung in Qdrant

Jeder Chunk wird als eigener Qdrant-Point mit eigener UUID, eigenem Vektor und eigenem Payload gespeichert.

| Payload-Feld   | Bedeutung                                   |
|----------------|---------------------------------------------|
| `title`        | Dateiname und lesbare Nummer des Chunks     |
| `content`      | Inhalt, für den das Embedding erzeugt wurde |
| `category`     | Kategorie des Dokuments                     |
| `source`       | ursprüngliche Quelldatei                    |
| `chunkIndex`   | Position im Dokument, beginnend bei `0`     |
| `documentName` | Verbindung zum ursprünglichen Dokument      |
| `chunkText`    | Text des einzelnen Chunks                   |

Qdrant kann Points in einer anderen Reihenfolge anzeigen. Die ursprüngliche Dokumentreihenfolge bleibt durch
`chunkIndex` erhalten.

## Manueller Test mit Postman und Qdrant

Für den Test wurde `chunking-test-bewerbungsassistent.txt` über folgenden Endpoint hochgeladen:

```text
POST /ingestion/upload
Body: form-data
Key: file
Type: File
```

Ergebnis:

```text
HTTP 201 Created
1 TXT-Datei
8 Chunks
8 Embeddings
8 Qdrant-Points
```

In der Qdrant Web UI wurden `chunkIndex`, `documentName`, `chunkText` und Vektoren mit einer Länge von `3072`
kontrolliert.

## Automatisierte Tests

Die Tests befinden sich in `src/ingestion/chunking.service.spec.ts`.

| Testfall                    | Erwartetes Verhalten                                   |
|-----------------------------|--------------------------------------------------------|
| Kurzer Lebenslauf           | wird als ein Chunk verarbeitet                         |
| Lange Stellenanzeige        | wird in mehrere Chunks aufgeteilt                      |
| Strukturiertes Anschreiben  | wichtige Inhalte bleiben erhalten                      |
| Fixed Size mit Overlap      | benachbarte Chunks teilen den vorgesehenen Kontext     |
| Leerer Text                 | wird mit `BadRequestException` abgelehnt               |
| `chunkSize <= 0`            | wird mit `BadRequestException` abgelehnt               |
| `overlap < 0`               | wird mit `BadRequestException` abgelehnt               |
| `overlap >= chunkSize`      | wird mit `BadRequestException` abgelehnt               |
| Nicht numerischer Parameter | wird mit `BadRequestException` abgelehnt               |
| Dezimalzahl als Parameter   | wird mit `BadRequestException` abgelehnt               |
| `overlap > 20 %`            | wird zum Schutz vor übermäßiger Duplizierung abgelehnt |

Tests ausführen:

```bash
npm test -- chunking.service.spec.ts
```

Aktuelles Ergebnis:

```text
Test Suites: 1 passed
Tests:       11 passed
```

## Installation und Start

```bash
npm install
npm run start:dev
```

Projekt kompilieren:

```bash
npm run build
```

## Ergebnis

Die Pipeline erzeugt aus einem langen Dokument mehrere geordnete Chunks. Jeder Chunk erhält ein eigenes Embedding, einen
eigenen Qdrant-Point und die erforderlichen Metadaten. Der Overlap erhält Kontext an Textgrenzen und ist gleichzeitig
auf 20 Prozent begrenzt, um unnötige Redundanz zu vermeiden.
