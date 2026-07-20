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

import { ResumeService } from './resume.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumeResponseDto } from './dto/resume-response.dto';
import { ResumeMappers } from './mapper/resume.mappers';

@ApiTags('resumes')
@Controller('resumes')
export class ResumeController {
    constructor(
        private readonly resumeService: ResumeService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Neuen Lebenslauf erstellen',
    })
    @ApiCreatedResponse({
        description:
            'Lebenslauf wurde erfolgreich erstellt',
        type: ResumeResponseDto,
    })
    async create(
        @Body() dto: CreateResumeDto,
    ): Promise<ResumeResponseDto> {
        const resume =
            await this.resumeService.create(dto);

        return ResumeMappers.toResponseDto(resume);
    }

    @Get()
    @ApiOperation({
        summary: 'Alle Lebensläufe abrufen',
    })
    @ApiOkResponse({
        description: 'Liste aller Lebensläufe',
        type: ResumeResponseDto,
        isArray: true,
    })
    async findAll(): Promise<ResumeResponseDto[]> {
        const resumes =
            await this.resumeService.findAll();

        return ResumeMappers.toResponseDtoList(resumes);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Lebenslauf nach ID abrufen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description: 'Gefundener Lebenslauf',
        type: ResumeResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Lebenslauf wurde nicht gefunden',
    })
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ResumeResponseDto> {
        const resume =
            await this.resumeService.findById(id);

        if (!resume) {
            throw new NotFoundException(
                `Resume with ID ${id} not found`,
            );
        }

        return ResumeMappers.toResponseDto(resume);
    }
}