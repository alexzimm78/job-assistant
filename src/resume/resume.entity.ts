import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Candidate} from "../candidate/candidate.entity";


@Entity('resumes')
export class Resume {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Candidate)
    @JoinColumn({name: 'candidate_id'})
    candidate: Candidate;

    @Column()
    title: string;

    @Column('text', {array: true})
    skills: string[];

    @Column()
    experience: string;
}