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

import { JobOfferService } from './job-offer.service';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { JobOfferResponseDto } from './dto/job-offer-response.dto';
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
        description: 'Stellenangebot wurde nicht gefunden',
    })
    async findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<JobOfferResponseDto> {
        const jobOffer =
            await this.jobOfferService.findById(id);

        if (!jobOffer) {
            throw new NotFoundException(
                `JobOffer with ID ${id} not found`,
            );
        }

        return JobOfferMapper.toResponseDto(jobOffer);
    }
}