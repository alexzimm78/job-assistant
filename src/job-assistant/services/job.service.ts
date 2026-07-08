import {Injectable} from '@nestjs/common';
import {Job} from '../models/job.model';

@Injectable()
export class JobService {
    findAll(): Job[] {
        return [
            {
                id: 1,
                title: 'Backend Developer',
                company: 'OpenAI',
                salary: 65000,
                isActive: true,
            },
            {
                id: 2,
                title: 'AI Engineer',
                company: 'Microsoft',
                salary: 72000,
                isActive: true,
            },
            {
                id: 3,
                title: 'IT Support',
                company: 'BMW',
                salary: 48000,
                isActive: true,
            },
        ];
    }
}