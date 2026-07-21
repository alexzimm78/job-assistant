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

import { ApplicationService } from './application.service';
import { ApplicationResponseDto } from './dto/application-response.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationMapper } from './mapper/application.mapper';

@ApiTags('applications')
@Controller('applications')
export class ApplicationController {
    constructor(
        private readonly applicationService: ApplicationService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Neue Bewerbung erstellen',
    })
    @ApiCreatedResponse({
        description:
            'Bewerbung wurde erfolgreich erstellt',
        type: ApplicationResponseDto,
    })
    @ApiNotFoundResponse({
        description:
            'Candidate, Resume oder JobOffer wurde nicht gefunden',
    })
    @ApiConflictResponse({
        description:
            'Der Kandidat hat sich bereits auf dieses Stellenangebot beworben',
    })
    async create(
        @Body() dto: CreateApplicationDto,
    ): Promise<ApplicationResponseDto> {
        const application =
            await this.applicationService.create(dto);

        return ApplicationMapper.toResponseDto(application);
    }

    @Get()
    @ApiOperation({
        summary: 'Alle Bewerbungen abrufen',
    })
    @ApiOkResponse({
        description: 'Liste aller Bewerbungen',
        type: ApplicationResponseDto,
        isArray: true,
    })
    async findAll(): Promise<ApplicationResponseDto[]> {
        const applications =
            await this.applicationService.findAll();

        return ApplicationMapper.toResponseDtoList(
            applications,
        );
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Bewerbung nach ID abrufen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description: 'Gefundene Bewerbung',
        type: ApplicationResponseDto,
    })
    @ApiNotFoundResponse({
        description: 'Bewerbung wurde nicht gefunden',
    })
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<ApplicationResponseDto> {
        const application =
            await this.applicationService.findById(id);

        return ApplicationMapper.toResponseDto(application);
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Bewerbung teilweise aktualisieren',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description:
            'Bewerbung wurde erfolgreich aktualisiert',
        type: ApplicationResponseDto,
    })
    @ApiNotFoundResponse({
        description:
            'Bewerbung, Candidate, Resume oder JobOffer wurde nicht gefunden',
    })
    @ApiConflictResponse({
        description:
            'Der Kandidat hat sich bereits auf dieses Stellenangebot beworben',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateApplicationDto,
    ): Promise<ApplicationResponseDto> {
        const application =
            await this.applicationService.update(id, dto);

        return ApplicationMapper.toResponseDto(application);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Bewerbung löschen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiNoContentResponse({
        description:
            'Bewerbung wurde erfolgreich gelöscht',
    })
    @ApiNotFoundResponse({
        description: 'Bewerbung wurde nicht gefunden',
    })
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.applicationService.remove(id);
    }
}