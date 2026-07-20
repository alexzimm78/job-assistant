import { Candidate } from '../../candidate/candidate.entity';
import { Resume } from '../../resume/resume.entity';
import { JobOffer } from '../../job-offer/job-offer.entity';

import { Application } from '../application.entity';
import { CreateApplicationDto } from '../dto/create-application.dto';
import { ApplicationResponseDto } from '../dto/application-response.dto';

export class ApplicationMapper {
    static toEntity(
        dto: CreateApplicationDto,
        candidate: Candidate,
        resume: Resume,
        jobOffer: JobOffer,
    ): Application {
        const application = new Application();

        application.candidate = candidate;
        application.resume = resume;
        application.jobOffer = jobOffer;
        application.coverLetter = dto.coverLetter;
        application.status = dto.status;
        application.sentAt = new Date(dto.sentAt);

        return application;
    }

    static toResponseDto(
        application: Application,
    ): ApplicationResponseDto {
        return {
            id: application.id,
            candidateId: application.candidate.id,
            resumeId: application.resume.id,
            jobOfferId: application.jobOffer.id,
            coverLetter: application.coverLetter,
            status: application.status,
            sentAt: application.sentAt,
        };
    }

    static toResponseDtoList(
        applications: Application[],
    ): ApplicationResponseDto[] {
        return applications.map((application) =>
            ApplicationMapper.toResponseDto(application),
        );
    }
}