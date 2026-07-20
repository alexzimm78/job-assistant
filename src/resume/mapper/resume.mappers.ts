import { Candidate } from '../../candidate/candidate.entity';
import { Resume } from '../resume.entity';
import { CreateResumeDto } from '../dto/create-resume.dto';
import { ResumeResponseDto } from '../dto/resume-response.dto';

export class ResumeMappers {
    static toEntity(
        dto: CreateResumeDto,
        candidate: Candidate,
    ): Resume {
        const resume = new Resume();

        resume.candidate = candidate;
        resume.title = dto.title;
        resume.skills = dto.skills;
        resume.experience = dto.experience;

        return resume;
    }

    static toResponseDto(
        resume: Resume,
    ): ResumeResponseDto {
        return {
            id: resume.id,
            candidateId: resume.candidate.id,
            title: resume.title,
            skills: resume.skills,
            experience: resume.experience,
        };
    }

    static toResponseDtoList(
        resumes: Resume[],
    ): ResumeResponseDto[] {
        return resumes.map((resume) =>
            ResumeMappers.toResponseDto(resume),
        );
    }
}