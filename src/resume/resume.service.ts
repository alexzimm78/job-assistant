import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Resume } from './resume.entity';

@Injectable()
export class ResumeService {
    constructor(
        @InjectRepository(Resume)
        private readonly resumeRepository: Repository<Resume>,
    ) {}

    findAll(): Promise<Resume[]> {
        return this.resumeRepository.find({
            relations: {
                candidate: true,
            },
        });
    }

    findById(id: number): Promise<Resume | null> {
        return this.resumeRepository.findOne({
            where: { id },
            relations: {
                candidate: true,
            },
        });
    }
}