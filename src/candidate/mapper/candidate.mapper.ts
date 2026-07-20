import { Candidate } from '../candidate.entity';
import { CreateCandidateDto } from '../dto/create-candidate.dto';
import { CandidateResponseDto } from '../dto/candidate-response.dto';

export class CandidateMapper {
    static toEntity(dto: CreateCandidateDto): Candidate {
        const candidate = new Candidate();

        candidate.fullName = dto.fullName;
        candidate.email = dto.email;
        candidate.phone = dto.phone;
        candidate.city = dto.city;

        return candidate;
    }

    static toResponseDto(candidate: Candidate): CandidateResponseDto {
        return {
            id: candidate.id,
            fullName: candidate.fullName,
            email: candidate.email,
            phone: candidate.phone,
            city: candidate.city,
        };
    }

    static toResponseDtoList(
        candidates: Candidate[],
    ): CandidateResponseDto[] {
        return candidates.map((candidate) =>
            CandidateMapper.toResponseDto(candidate),

        );
    }
}