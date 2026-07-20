import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
} from '@nestjs/common';

import {
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CandidateResponseDto } from './dto/candidate-response.dto';
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

        if (!candidate) {
            throw new NotFoundException(
                `Candidate with ID ${id} not found`,
            );
        }

        return CandidateMapper.toResponseDto(candidate);
    }
}