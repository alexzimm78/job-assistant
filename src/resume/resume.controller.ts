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
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumeResponseDto } from './dto/resume-response.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeMappers } from './mapper/resume.mappers';
import { ResumeService } from './resume.service';

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
    @ApiNotFoundResponse({
        description: 'Kandidat wurde nicht gefunden',
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

        return ResumeMappers.toResponseDto(resume);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Lebenslauf teilweise aktualisieren',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description:
            'Lebenslauf wurde erfolgreich aktualisiert',
        type: ResumeResponseDto,
    })
    @ApiNotFoundResponse({
        description:
            'Lebenslauf oder Kandidat wurde nicht gefunden',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateResumeDto,
    ): Promise<ResumeResponseDto> {
        const resume =
            await this.resumeService.update(id, dto);

        return ResumeMappers.toResponseDto(resume);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Lebenslauf löschen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiNoContentResponse({
        description:
            'Lebenslauf wurde erfolgreich gelöscht',
    })
    @ApiNotFoundResponse({
        description: 'Lebenslauf wurde nicht gefunden',
    })
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.resumeService.remove(id);
    }
}