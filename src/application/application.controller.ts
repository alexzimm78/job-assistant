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

import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationResponseDto } from './dto/application-response.dto';
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

        if (!application) {
            throw new NotFoundException(
                `Application with ID ${id} not found`,
            );
        }

        return ApplicationMapper.toResponseDto(application);
    }
}