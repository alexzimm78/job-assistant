<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Document Ingestion und Chunking

### Geplante Dokumente

In diesem Projekt werden Lebensläufe, Stellenanzeigen, Anschreiben
und weitere Dokumente aus dem Bewerbungsprozess verarbeitet.

Diese Dokumente können mehrere längere Abschnitte enthalten.
Informationen wie Berufserfahrung, Ausbildung, Kenntnisse und
Anforderungen können sich über verschiedene Textbereiche verteilen.

### Gewählte Chunking-Strategie

Als Hauptstrategie wird eine feste Chunk-Größe mit Overlap verwendet:

```text
chunkSize = 1000 Zeichen
overlap = 200 Zeichen
```

Der Overlap beträgt 20 Prozent der Chunk-Größe.

Diese Strategie wurde gewählt, weil wichtige Aussagen an der Grenze
zwischen zwei Chunks stehen können. Durch den Overlap bleibt ein Teil
des vorherigen Textes im folgenden Chunk erhalten. Dadurch geht beim
späteren semantischen Suchen weniger Kontext verloren.

### Ingestion Pipeline

```text
TXT-Datei
    ↓
Text extrahieren
    ↓
Text bereinigen
    ↓
ChunkingService
    ↓
Chunks
    ↓
EmbeddingsService
    ↓
VectorStorageService
    ↓
Qdrant
```

Jeder Chunk erhält ein eigenes Embedding und wird als separater Point
in Qdrant gespeichert.

Im Payload jedes Points werden folgende Metadaten gespeichert:

```text
chunkIndex
documentName
chunkText
```

`chunkIndex` speichert die ursprüngliche Reihenfolge der Chunks.
`documentName` verbindet den Chunk mit der Quelldatei.
`chunkText` enthält den Text, für den das Embedding erzeugt wurde.

### Test

Für den Test wurde die Datei
`chunking-test-bewerbungsassistent.txt` über Postman hochgeladen.

Testergebnis:

```text
1 TXT-Datei
8 Chunks
8 Embeddings
8 Qdrant-Points
```

Der Upload wurde mit dem HTTP-Status `201 Created` abgeschlossen.
Die erzeugten Points und ihre Metadaten wurden anschließend in der
Qdrant Web UI kontrolliert.

### Automatisierte Validierung der Chunking-Strategie

Die gewählte Chunking-Strategie wurde mit unterschiedlichen
Dokumentarten, Textgrößen und Parametern getestet.

| Testfall | Erwartetes Verhalten |
| --- | --- |
| Kurzer Lebenslauf | Wird als ein Chunk verarbeitet |
| Lange Stellenanzeige | Wird in mehrere Chunks aufgeteilt |
| Strukturiertes Anschreiben | Inhalt und Struktur bleiben erhalten |
| Fixed Size mit Overlap | Benachbarte Chunks teilen gemeinsamen Kontext |
| Leerer Text | Wird mit `BadRequestException` abgelehnt |
| `chunkSize <= 0` | Wird mit `BadRequestException` abgelehnt |
| `overlap < 0` | Wird mit `BadRequestException` abgelehnt |
| `overlap >= chunkSize` | Wird mit `BadRequestException` abgelehnt |
| Nicht numerischer Parameter | Wird mit `BadRequestException` abgelehnt |
| Dezimalzahl als Parameter | Wird mit `BadRequestException` abgelehnt |

Die automatisierten Tests befinden sich in:

```text
src/ingestion/chunking.service.spec.ts
```

Ausführung:

```bash
npm test -- chunking.service.spec.ts
```

Testergebnis:

```text
Test Suites: 1 passed
Tests:       10 passed
```

Damit wurde nachgewiesen, dass die Strategie sowohl kurze als auch
lange und strukturierte Bewerbungsdokumente verarbeitet und ungültige
Parameter kontrolliert ablehnt.


### Detaillierte Begründung der Designentscheidung

Die Pipeline verarbeitet hauptsächlich Dokumente aus dem
Bewerbungsbereich:

| Dokumenttyp | Typische Eigenschaften | Nutzen der Strategie |
| --- | --- | --- |
| Lebenslauf | Überschriften, Listen und unterschiedlich lange Abschnitte | Längere Bereiche werden in vergleichbar große Chunks zerlegt |
| Stellenanzeige | Lange Aufgaben- und Anforderungsbeschreibungen | Einzelne Anforderungen bleiben gezielt auffindbar |
| Anschreiben | Zusammenhängender Fließtext | Der Overlap erhält den Zusammenhang zwischen benachbarten Textteilen |
| Kunden- und Projektdokumente | Unterschiedliche Länge und Struktur | Fixed Size liefert ein vorhersehbares Verhalten |

Als Strategie wird **Fixed Size mit Overlap** verwendet. Die
Standardgröße beträgt `1000` Zeichen. Davon werden `200` Zeichen in
den folgenden Chunk übernommen.

Der Overlap entspricht 20 Prozent der Chunk-Größe:

```text
200 / 1000 = 0,20 = 20 %
```

Ohne Overlap könnte eine wichtige Aussage genau an einer Chunk-Grenze
getrennt werden. Der wiederholte Textbereich sorgt dafür, dass beide
benachbarten Chunks einen Teil des gemeinsamen Kontextes enthalten.

Die Schrittweite beträgt:

```text
step = chunkSize - overlap
step = 1000 - 200
step = 800 Zeichen
```

Kurze Dokumente unterhalb der Chunk-Größe bleiben als ein einzelner
Chunk erhalten. Längere Dokumente werden in mehrere überlappende
Chunks aufgeteilt.

### Verarbeitung von Embeddings und Qdrant-Metadaten

Der `IngestionService` koordiniert die vollständige Verarbeitung:

1. `TextExtractorService` extrahiert den Text aus der TXT-Datei.
2. `CleanService` bereinigt den extrahierten Text.
3. `ChunkingService` erzeugt ein geordnetes `string[]` mit Chunks.
4. `EmbeddingsService` erhält das vollständige Chunk-Array.
5. Für jeden Chunk wird genau ein separates Embedding erzeugt.
6. Die Anzahl der Embeddings wird mit der Anzahl der Chunks geprüft.
7. `VectorStorageService` erstellt für jeden Chunk einen Qdrant-Point.
8. Jeder Point erhält eine eigene UUID, einen Vektor und ein Payload.

Beispiel:

```text
8 Chunks
    ↓
8 Embeddings
    ↓
8 Qdrant-Points
```

Wenn die Anzahl der Embeddings nicht mit der Anzahl der Dokumente
übereinstimmt, wird eine `InternalServerErrorException` ausgelöst.
Dadurch kann kein Chunk mit einem falschen Embedding verbunden werden.

Das Payload jedes Qdrant-Points enthält:

| Feld | Bedeutung |
| --- | --- |
| `title` | Dateiname und lesbare Nummer des Chunks |
| `content` | Inhalt, für den das Embedding erzeugt wurde |
| `category` | Kategorie des gespeicherten Dokuments |
| `source` | Name der ursprünglichen Quelldatei |
| `chunkIndex` | Position des Chunks, beginnend bei `0` |
| `documentName` | Verbindung zum ursprünglichen Dokument |
| `chunkText` | Originaltext des einzelnen Chunks |

Qdrant kann Points in einer anderen Reihenfolge anzeigen. Die
ursprüngliche Dokumentreihenfolge bleibt über `chunkIndex` erhalten.

### Konfiguration der Chunking-Parameter

Chunk-Größe und Overlap sind über Umgebungsvariablen konfigurierbar:

```env
DOCUMENT_CHUNK_SIZE=1000
DOCUMENT_CHUNK_OVERLAP=200
```

Wenn die Variablen nicht vorhanden sind, verwendet die Anwendung
automatisch die Standardwerte `1000` und `200`.

Dadurch können die Parameter später an andere Dokumenttypen angepasst
werden, ohne den TypeScript-Code zu verändern.

Die Parameter werden validiert:

```text
chunkSize muss eine positive ganze Zahl sein
overlap muss eine nicht negative ganze Zahl sein
overlap muss kleiner als chunkSize sein
```

Ungültige Werte führen kontrolliert zu einer
`BadRequestException`.