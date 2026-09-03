import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  ApiBadGatewayResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

import { IngestionService } from './ingestion.service';
import { IngestDocumentRequestDto } from './dto/ingest-document-request.dto';
import { UploadDocumentResponseDto } from './dto/upload-document-response.dto';

@ApiTags('ingestion')
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  // --------------------------------------------------
  // TEXT DIREKT IN QDRANT SPEICHERN
  // --------------------------------------------------

  @Public()
  @Post()
  @ApiOperation({
    summary: 'Text als ein Dokument in Qdrant speichern',
  })
  @ApiCreatedResponse({
    description: 'Das Dokument wurde erfolgreich gespeichert',
    schema: {
      example: {
        saved: 1,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Der übergebene Text ist ungültig',
  })
  @ApiBadGatewayResponse({
    description: 'Fehler bei der Verbindung zum AI API oder zu Qdrant',
  })
  async ingestDocument(
    @Body()
    dto: IngestDocumentRequestDto,
  ): Promise<{
    saved: number;
  }> {
    const saved = await this.ingestionService.ingestDocument(dto);

    return {
      saved,
    };
  }

  // --------------------------------------------------
  // TXT-, PDF- ODER DOCX-DATEI HOCHLADEN
  // --------------------------------------------------

  @Public()
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Unterstützte Formate: TXT, PDF und DOCX',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'TXT-, PDF- oder DOCX-Datei hochladen und in Qdrant speichern',
  })
  @ApiCreatedResponse({
    description: 'Die Datei wurde verarbeitet und als Chunks gespeichert',
    type: UploadDocumentResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Datei fehlt, ist leer oder besitzt ein nicht unterstütztes Format',
  })
  @ApiBadGatewayResponse({
    description: 'Fehler bei der Verbindung zum AI API oder zu Qdrant',
  })
  async uploadFile(
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<UploadDocumentResponseDto> {
    if (!file) {
      throw new BadRequestException(
        'Bitte laden Sie eine TXT-, PDF- oder DOCX-Datei hoch.',
      );
    }

    const chunksCreated = await this.ingestionService.ingestUploadedFile(file);

    return {
      chunksCreated,
    };
  }
}
