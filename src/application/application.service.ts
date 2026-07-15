import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './application.entity';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,
    ) {}

    findAll(): Promise<Application[]> {
        return this.applicationRepository.find({
            relations: {
                candidate: true,
                resume: true,
                jobOffer: true,
            },
        });
    }

    findById(id: number): Promise<Application | null> {
        return this.applicationRepository.findOne({
            where: { id },
            relations: {
                candidate: true,
                resume: true,
                jobOffer: true,
            },
        });
    }
}