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
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { JobOfferResponseDto } from './dto/job-offer-response.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { JobOfferService } from './job-offer.service';
import { JobOfferMapper } from './mapper/job-offer.mapper';

@ApiTags('job-offers')
@Controller('job-offers')
export class JobOfferController {
    constructor(
        private readonly jobOfferService: JobOfferService,
    ) {}

    @Post()
    @ApiOperation({
        summary: 'Neues Stellenangebot erstellen',
    })
    @ApiCreatedResponse({
        description:
            'Stellenangebot wurde erfolgreich erstellt',
        type: JobOfferResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Ungültiger Gehaltsbereich',
    })
    async create(
        @Body() dto: CreateJobOfferDto,
    ): Promise<JobOfferResponseDto> {
        const jobOffer =
            await this.jobOfferService.create(dto);

        return JobOfferMapper.toResponseDto(jobOffer);
    }

    @Get()
    @ApiOperation({
        summary: 'Alle Stellenangebote abrufen',
    })
    @ApiOkResponse({
        description: 'Liste aller Stellenangebote',
        type: JobOfferResponseDto,
        isArray: true,
    })
    async findAll(): Promise<JobOfferResponseDto[]> {
        const jobOffers =
            await this.jobOfferService.findAll();

        return JobOfferMapper.toResponseDtoList(jobOffers);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Stellenangebot nach ID abrufen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description: 'Gefundenes Stellenangebot',
        type: JobOfferResponseDto,
    })
    @ApiNotFoundResponse({
        description:
            'Stellenangebot wurde nicht gefunden',
    })
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<JobOfferResponseDto> {
        const jobOffer =
            await this.jobOfferService.findById(id);

        return JobOfferMapper.toResponseDto(jobOffer);
    }

    @Patch(':id')
    @ApiOperation({
        summary:
            'Stellenangebot teilweise aktualisieren',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiOkResponse({
        description:
            'Stellenangebot wurde erfolgreich aktualisiert',
        type: JobOfferResponseDto,
    })
    @ApiNotFoundResponse({
        description:
            'Stellenangebot wurde nicht gefunden',
    })
    @ApiBadRequestResponse({
        description: 'Ungültiger Gehaltsbereich',
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateJobOfferDto,
    ): Promise<JobOfferResponseDto> {
        const jobOffer =
            await this.jobOfferService.update(id, dto);

        return JobOfferMapper.toResponseDto(jobOffer);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Stellenangebot löschen',
    })
    @ApiParam({
        name: 'id',
        type: Number,
        example: 1,
    })
    @ApiNoContentResponse({
        description:
            'Stellenangebot wurde erfolgreich gelöscht',
    })
    @ApiNotFoundResponse({
        description:
            'Stellenangebot wurde nicht gefunden',
    })
    async remove(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<void> {
        await this.jobOfferService.remove(id);
    }
}