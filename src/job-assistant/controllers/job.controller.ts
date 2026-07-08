import {Controller, Get} from '@nestjs/common';
import {JobService} from '../services/job.service';
import {Job} from '../models/job.model';

@Controller('jobs')
export class JobController {
    constructor(private readonly jobService: JobService) {
    }

    @Get()
    findAll(): Job[] {
        return this.jobService.findAll();
    }
}
