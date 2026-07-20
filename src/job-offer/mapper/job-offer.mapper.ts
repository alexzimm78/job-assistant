import { JobOffer } from '../job-offer.entity';
import { CreateJobOfferDto } from '../dto/create-job-offer.dto';
import { JobOfferResponseDto } from '../dto/job-offer-response.dto';

export class JobOfferMapper {
    static toEntity(
        dto: CreateJobOfferDto,
    ): JobOffer {
        const jobOffer = new JobOffer();

        jobOffer.companyName = dto.companyName;
        jobOffer.position = dto.position;
        jobOffer.city = dto.city;
        jobOffer.salaryFrom = dto.salaryFrom;
        jobOffer.salaryTo = dto.salaryTo;
        jobOffer.employmentType = dto.employmentType;

        return jobOffer;
    }

    static toResponseDto(
        jobOffer: JobOffer,
    ): JobOfferResponseDto {
        return {
            id: jobOffer.id,
            companyName: jobOffer.companyName,
            position: jobOffer.position,
            city: jobOffer.city,
            salaryFrom: jobOffer.salaryFrom,
            salaryTo: jobOffer.salaryTo,
            employmentType: jobOffer.employmentType,
        };
    }

    static toResponseDtoList(
        jobOffers: JobOffer[],
    ): JobOfferResponseDto[] {
        return jobOffers.map((jobOffer) =>
            JobOfferMapper.toResponseDto(jobOffer),
        );
    }
}