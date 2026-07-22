import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from '../candidate/candidate.entity';
import { CandidateNotFoundException } from '../candidate/exceptions/candidate-not-found.exception';
import { JobOfferNotFoundException } from '../job-offer/exceptions/job-offer-not-found.exception';
import { JobOffer } from '../job-offer/job-offer.entity';
import { ResumeNotFoundException } from '../resume/exceptions/resume-not-found.exception';
import { Resume } from '../resume/resume.entity';
import { Application } from './application.entity';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationStatus } from './enums/application-status.enum';
import { ApplicationAlreadyExistsException } from './exceptions/application-already-exists.exception';
import { ApplicationNotFoundException } from './exceptions/application-not-found.exception';

describe('ApplicationService', (): void => {
  let service: ApplicationService;

  let applicationRepository: jest.Mocked<
      Pick<
          Repository<Application>,
          'findOne' | 'find' | 'save' | 'remove'
      >
  >;

  let candidateRepository: jest.Mocked<
      Pick<Repository<Candidate>, 'findOneBy'>
  >;

  let resumeRepository: jest.Mocked<
      Pick<Repository<Resume>, 'findOneBy'>
  >;

  let jobOfferRepository: jest.Mocked<
      Pick<Repository<JobOffer>, 'findOneBy'>
  >;

  const candidate: Candidate = {
    id: 1,
    fullName: 'Alexander Zimmermann',
    email: 'alex@example.com',
    phone: '+49123456789',
    city: 'Berlin',
  } as Candidate;

  const resume: Resume = {
    id: 1,
    candidate,
    title: 'Junior AI Engineer',
    skills: ['TypeScript', 'NestJS', 'Jest'],
    experience: 'Backend project development',
  } as Resume;

  const jobOffer: JobOffer = {
    id: 1,
    companyName: 'QSL',
    position: 'Junior IT Support',
    city: 'Wildau',
    salaryFrom: 35000,
    salaryTo: 45000,
    employmentType: 'FULL_TIME',
  } as JobOffer;

  const application: Application = {
    id: 1,
    candidate,
    resume,
    jobOffer,
    coverLetter:
        'Hiermit bewerbe ich mich auf die ausgeschriebene Stelle.',
    status: ApplicationStatus.SENT,
    sentAt: new Date('2026-07-22T10:00:00.000Z'),
  } as Application;

  const createDto: CreateApplicationDto = {
    candidateId: 1,
    resumeId: 1,
    jobOfferId: 1,
    coverLetter:
        'Hiermit bewerbe ich mich auf die ausgeschriebene Stelle.',
    status: ApplicationStatus.SENT,
    sentAt: '2026-07-22T10:00:00.000Z',
  };

  beforeEach(async (): Promise<void> => {
    applicationRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    candidateRepository = {
      findOneBy: jest.fn(),
    };

    resumeRepository = {
      findOneBy: jest.fn(),
    };

    jobOfferRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule =
        await Test.createTestingModule({
          providers: [
            ApplicationService,
            {
              provide:
                  getRepositoryToken(Application),
              useValue: applicationRepository,
            },
            {
              provide:
                  getRepositoryToken(Candidate),
              useValue: candidateRepository,
            },
            {
              provide:
                  getRepositoryToken(Resume),
              useValue: resumeRepository,
            },
            {
              provide:
                  getRepositoryToken(JobOffer),
              useValue: jobOfferRepository,
            },
          ],
        }).compile();

    service = module.get<ApplicationService>(
        ApplicationService,
    );

    jest.clearAllMocks();
  });

  describe('create', (): void => {
    it('should create and return an application', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOneBy.mockResolvedValue(
          candidate,
      );
      resumeRepository.findOneBy.mockResolvedValue(
          resume,
      );
      jobOfferRepository.findOneBy.mockResolvedValue(
          jobOffer,
      );
      applicationRepository.findOne.mockResolvedValue(
          null,
      );
      applicationRepository.save.mockResolvedValue(
          application,
      );

      // Act
      const result: Application =
          await service.create(createDto);

      // Assert
      expect(result).toBe(application);

      expect(
          candidateRepository.findOneBy,
      ).toHaveBeenCalledWith({
        id: createDto.candidateId,
      });

      expect(
          resumeRepository.findOneBy,
      ).toHaveBeenCalledWith({
        id: createDto.resumeId,
      });

      expect(
          jobOfferRepository.findOneBy,
      ).toHaveBeenCalledWith({
        id: createDto.jobOfferId,
      });

      expect(
          applicationRepository.save,
      ).toHaveBeenCalledTimes(1);
    });

    it('should throw CandidateNotFoundException when candidate does not exist', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOneBy.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.create(createDto),
      ).rejects.toBeInstanceOf(
          CandidateNotFoundException,
      );

      expect(
          resumeRepository.findOneBy,
      ).not.toHaveBeenCalled();

      expect(
          applicationRepository.save,
      ).not.toHaveBeenCalled();
    });

    it('should throw ResumeNotFoundException when resume does not exist', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOneBy.mockResolvedValue(
          candidate,
      );
      resumeRepository.findOneBy.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.create(createDto),
      ).rejects.toBeInstanceOf(
          ResumeNotFoundException,
      );

      expect(
          jobOfferRepository.findOneBy,
      ).not.toHaveBeenCalled();

      expect(
          applicationRepository.save,
      ).not.toHaveBeenCalled();
    });

    it('should throw JobOfferNotFoundException when job offer does not exist', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOneBy.mockResolvedValue(
          candidate,
      );
      resumeRepository.findOneBy.mockResolvedValue(
          resume,
      );
      jobOfferRepository.findOneBy.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.create(createDto),
      ).rejects.toBeInstanceOf(
          JobOfferNotFoundException,
      );

      expect(
          applicationRepository.save,
      ).not.toHaveBeenCalled();
    });

    it('should throw ApplicationAlreadyExistsException when application already exists', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOneBy.mockResolvedValue(
          candidate,
      );
      resumeRepository.findOneBy.mockResolvedValue(
          resume,
      );
      jobOfferRepository.findOneBy.mockResolvedValue(
          jobOffer,
      );
      applicationRepository.findOne.mockResolvedValue(
          application,
      );

      // Act and Assert
      await expect(
          service.create(createDto),
      ).rejects.toBeInstanceOf(
          ApplicationAlreadyExistsException,
      );

      expect(
          applicationRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findAll', (): void => {
    it('should return all applications with relations', async (): Promise<void> => {
      // Arrange
      const applications: Application[] = [
        application,
        {
          ...application,
          id: 2,
        } as Application,
      ];

      applicationRepository.find.mockResolvedValue(
          applications,
      );

      // Act
      const result: Application[] =
          await service.findAll();

      // Assert
      expect(result).toEqual(applications);
      expect(result).toHaveLength(2);

      expect(
          applicationRepository.find,
      ).toHaveBeenCalledWith({
        relations: {
          candidate: true,
          resume: true,
          jobOffer: true,
        },
      });
    });
  });

  describe('findById', (): void => {
    it('should return application by id', async (): Promise<void> => {
      // Arrange
      applicationRepository.findOne.mockResolvedValue(
          application,
      );

      // Act
      const result: Application =
          await service.findById(1);

      // Assert
      expect(result).toBe(application);

      expect(
          applicationRepository.findOne,
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        relations: {
          candidate: true,
          resume: true,
          jobOffer: true,
        },
      });
    });

    it('should throw ApplicationNotFoundException when application does not exist', async (): Promise<void> => {
      // Arrange
      applicationRepository.findOne.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.findById(999),
      ).rejects.toBeInstanceOf(
          ApplicationNotFoundException,
      );

      expect(
          applicationRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('update', (): void => {
    it('should update and return an application', async (): Promise<void> => {
      // Arrange
      const updateDto: UpdateApplicationDto = {
        coverLetter: 'Aktualisiertes Anschreiben',
        status: ApplicationStatus.SENT,
        sentAt: '2026-07-23T12:00:00.000Z',
      };

      const applicationToUpdate: Application = {
        ...application,
      } as Application;

      const updatedApplication: Application = {
        ...applicationToUpdate,
        coverLetter: updateDto.coverLetter,
        status: updateDto.status,
        sentAt: new Date(updateDto.sentAt!),
      } as Application;

      applicationRepository.findOne
          .mockResolvedValueOnce(applicationToUpdate)
          .mockResolvedValueOnce(null);

      applicationRepository.save.mockResolvedValue(
          updatedApplication,
      );

      // Act
      const result: Application =
          await service.update(1, updateDto);

      // Assert
      expect(result).toBe(updatedApplication);

      expect(
          applicationRepository.save,
      ).toHaveBeenCalledWith(
          expect.objectContaining({
            coverLetter:
                'Aktualisiertes Anschreiben',
            status: ApplicationStatus.SENT,
            sentAt: new Date(
                '2026-07-23T12:00:00.000Z',
            ),
          }),
      );
    });
  });

  describe('remove', (): void => {
    it('should remove an existing application', async (): Promise<void> => {
      // Arrange
      applicationRepository.findOne.mockResolvedValue(
          application,
      );

      applicationRepository.remove.mockResolvedValue(
          application,
      );

      // Act
      await service.remove(1);

      // Assert
      expect(
          applicationRepository.remove,
      ).toHaveBeenCalledWith(application);
    });
  });
});