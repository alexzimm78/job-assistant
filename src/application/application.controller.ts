import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { Application } from './application.entity';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
    constructor(
        private readonly applicationService: ApplicationService,
    ) {}

    @Get()
    findAll(): Promise<Application[]> {
        return this.applicationService.findAll();
    }

    @Get(':id')
    findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Application | null> {
        return this.applicationService.findById(id);
    }
}