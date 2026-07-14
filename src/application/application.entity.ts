import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from "typeorm";
import {Candidate} from "../candidate/candidate.entity";
import {Resume} from "../resume/resume.entity";
import {JobOffer} from "../job-offer/job-offer.entity";
import {ApplicationStatus} from "./enums/application-status.enum";


@Entity('applications')
export class Application {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Candidate)
    @JoinColumn({name: 'candidate_id'})
    candidate: Candidate;

    @ManyToOne(() => Resume)
    @JoinColumn({name: 'resume_id'})
    resume: Resume;

    @ManyToOne(() => JobOffer)
    @JoinColumn({name: 'job_offer_id'})
    jobOffer: JobOffer;

    @Column()
    coverLetter: string;

    @Column({
        type: 'enum',
        enum: ApplicationStatus
    })
    status: ApplicationStatus;

    @Column({
        type: 'timestamp',
    })
    sentAt: Date;
}