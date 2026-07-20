import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { EmploymentType } from './enums/employment-type.enum';

@Entity('job_offers')
export class JobOffer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    companyName: string;

    @Column()
    position: string;

    @Column()
    city: string;

    @Column()
    salaryFrom: number;

    @Column()
    salaryTo: number;

    @Column({
        type: 'enum',
        enum: EmploymentType,
    })
    employmentType: EmploymentType;
}