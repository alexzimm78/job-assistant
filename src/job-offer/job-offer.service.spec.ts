import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { InvalidSalaryRangeException } from './exceptions/invalid-salary-range.exception';
import { JobOfferNotFoundException } from './exceptions/job-offer-not-found.exception';
import { JobOffer } from './job-offer.entity';
import { JobOfferService } from './job-offer.service';

describe('JobOfferService', (): void => {
  let service: JobOfferService;
  let jobOfferRepository: jest.Mocked<
      Pick<
          Repository<JobOffer>,
          'findOne' | 'find' | 'save' | 'merge' | 'remove'
      >
  >;

  const jobOffer: JobOffer = {
    id: 1,
    companyName: 'QSL',
    position: 'Junior IT Support',
    city: 'Wildau',
    salaryFrom: 35000,
    salaryTo: 45000,
    employmentType: 'FULL_TIME',
  } as JobOffer;

  const createDto: CreateJobOfferDto = {
    companyName: 'QSL',
    position: 'Junior IT Support',
    city: 'Wildau',
    salaryFrom: 35000,
    salaryTo: 45000,
    employmentType: 'FULL_TIME',
  } as CreateJobOfferDto;

  beforeEach(async (): Promise<void> => {
    jobOfferRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule =
        await Test.createTestingModule({
          providers: [
            JobOfferService,
            {
              provide:
                  getRepositoryToken(JobOffer),
              useValue: jobOfferRepository,
            },
          ],
        }).compile();

    service = module.get<JobOfferService>(
        JobOfferService,
    );

    jest.clearAllMocks();
  });

  describe('create', (): void => {
    it('should create and return a job offer', async (): Promise<void> => {
      // Arrange
      jobOfferRepository.save.mockResolvedValue(
          jobOffer,
      );

      // Act
      const result: JobOffer =
          await service.create(createDto);

      // Assert
      expect(result).toBe(jobOffer);

      expect(
          jobOfferRepository.save,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw InvalidSalaryRangeException when salaryFrom is greater than salaryTo', async (): Promise<void> => {
      // Arrange
      const invalidDto: CreateJobOfferDto = {
        ...createDto,
        salaryFrom: 50000,
        salaryTo: 40000,
      };

      // Act and Assert
      await expect(
          service.create(invalidDto),
      ).rejects.toBeInstanceOf(
          InvalidSalaryRangeException,
      );

      expect(
          jobOfferRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findAll', (): void => {
    it('should return all job offers', async (): Promise<void> => {
      // Arrange
      const jobOffers: JobOffer[] = [
        jobOffer,
        {
          ...jobOffer,
          id: 2,
          companyName: 'Meyer Logistik',
          position: 'Application Support',
        } as JobOffer,
      ];

      jobOfferRepository.find.mockResolvedValue(
          jobOffers,
      );

      // Act
      const result: JobOffer[] =
          await service.findAll();

      // Assert
      expect(result).toEqual(jobOffers);
      expect(result).toHaveLength(2);

      expect(
          jobOfferRepository.find,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', (): void => {
    it('should return job offer by id', async (): Promise<void> => {
      // Arrange
      jobOfferRepository.findOne.mockResolvedValue(
          jobOffer,
      );

      // Act
      const result: JobOffer =
          await service.findById(1);

      // Assert
      expect(result).toBe(jobOffer);

      expect(
          jobOfferRepository.findOne,
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should throw JobOfferNotFoundException when job offer does not exist', async (): Promise<void> => {
      // Arrange
      jobOfferRepository.findOne.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.findById(999),
      ).rejects.toBeInstanceOf(
          JobOfferNotFoundException,
      );
    });
  });

  describe('update', (): void => {
    it('should update and return a job offer', async (): Promise<void> => {
      // Arrange
      const updateDto: UpdateJobOfferDto = {
        salaryFrom: 40000,
        salaryTo: 50000,
      };

      const updatedJobOffer: JobOffer = {
        ...jobOffer,
        salaryFrom: 40000,
        salaryTo: 50000,
      } as JobOffer;

      jobOfferRepository.findOne.mockResolvedValue(
          jobOffer,
      );

      jobOfferRepository.save.mockResolvedValue(
          updatedJobOffer,
      );

      // Act
      const result: JobOffer =
          await service.update(1, updateDto);

      // Assert
      expect(result).toBe(updatedJobOffer);

      expect(
          jobOfferRepository.merge,
      ).toHaveBeenCalledWith(
          jobOffer,
          updateDto,
      );

      expect(
          jobOfferRepository.save,
      ).toHaveBeenCalledWith(jobOffer);
    });

    it('should throw InvalidSalaryRangeException when updated salary range is invalid', async (): Promise<void> => {
      // Arrange
      const updateDto: UpdateJobOfferDto = {
        salaryFrom: 60000,
        salaryTo: 40000,
      };

      jobOfferRepository.findOne.mockResolvedValue(
          jobOffer,
      );

      // Act and Assert
      await expect(
          service.update(1, updateDto),
      ).rejects.toBeInstanceOf(
          InvalidSalaryRangeException,
      );

      expect(
          jobOfferRepository.merge,
      ).not.toHaveBeenCalled();

      expect(
          jobOfferRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('remove', (): void => {
    it('should remove an existing job offer', async (): Promise<void> => {
      // Arrange
      jobOfferRepository.findOne.mockResolvedValue(
          jobOffer,
      );

      jobOfferRepository.remove.mockResolvedValue(
          jobOffer,
      );

      // Act
      await service.remove(1);

      // Assert
      expect(
          jobOfferRepository.remove,
      ).toHaveBeenCalledWith(jobOffer);
    });
  });
});