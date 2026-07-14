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
}