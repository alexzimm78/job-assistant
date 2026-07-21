import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
} from '@nestjs/common';

import {
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { CandidateService } from './candidate.service';
import { CandidateResponseDto } from './dto/candidate-response.dto';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateMapper } from './mapper/candidate.mapper';

@ApiTags('candidates')
@Controller('candidates')
export class CandidateController {
    constructor(
        private readonly candidateService: CandidateService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Neuen Kandidaten erstellen',
    })
    @ApiCreatedResponse({
        description:
            'Kandidat wurde erfolgreich erstellt',
        type: CandidateResponseDto,
    })
    @ApiConflictResponse({
        description:
            'Kandidat mit dieser E-Mail existiert bereits',
    })
    async create(
        @Body() dto: CreateCandidateDto,
    ): Promise<CandidateResponseDto> {
        const candidate =
            await this.candidateService.create(dto);

        return CandidateMapper.toResponseDto(candidate);
    }

    @Get()
    @ApiOperation({
        summary: 'Alle Kandidaten abrufen',
    })
    @ApiOkResponse({
        description: 'Liste aller Kandidaten',
        type: CandidateResponseDto,
        isArray: true,
    })
    async findAll(): Promise<CandidateResponseDto[]> {
        const candidates =
            await this.candidateService.findAll();

        return CandidateMapper.toResponseDtoList(candidates);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Kandidat nach ID abrufen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description: 'Gefundener Kandidat',
        type: CandidateResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Kandidat wurde nicht gefunden',
    })
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<CandidateResponseDto> {
        const candidate =
            await this.candidateService.findById(id);

        return CandidateMapper.toResponseDto(candidate);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Kandidaten teilweise aktualisieren',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description:
            'Kandidat wurde erfolgreich aktualisiert',
        type: CandidateResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Kandidat wurde nicht gefunden',
    })
    @ApiConflictResponse({
        description:
            'Kandidat mit dieser E-Mail existiert bereits',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCandidateDto,
    ): Promise<CandidateResponseDto> {
        const candidate =
            await this.candidateService.update(id, dto);

        return CandidateMapper.toResponseDto(candidate);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Kandidaten löschen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiNoContentResponse({
        description:
            'Kandidat wurde erfolgreich gelöscht',
    })
    @ApiNotFoundResponse({
        description: 'Kandidat wurde nicht gefunden',
    })
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.candidateService.remove(id);
    }
}