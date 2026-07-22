import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from '../candidate/candidate.entity';
import { CandidateNotFoundException } from '../candidate/exceptions/candidate-not-found.exception';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeNotFoundException } from './exceptions/resume-not-found.exception';
import { Resume } from './resume.entity';
import { ResumeService } from './resume.service';

describe('ResumeService', (): void => {
  let service: ResumeService;

  let resumeRepository: jest.Mocked<
      Pick<
          Repository<Resume>,
          'findOne' | 'find' | 'save' | 'remove'
      >
  >;

  let candidateRepository: jest.Mocked<
      Pick<Repository<Candidate>, 'findOneBy'>
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
    skills: [
      'TypeScript',
      'NestJS',
      'PostgreSQL',
    ],
    experience: 'Backend project development',
  } as Resume;

  const createDto: CreateResumeDto = {
    candidateId: 1,
    title: 'Junior AI Engineer',
    skills: [
      'TypeScript',
      'NestJS',
      'PostgreSQL',
    ],
    experience: 'Backend project development',
  };

  beforeEach(async (): Promise<void> => {
    resumeRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    candidateRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule =
        await Test.createTestingModule({
          providers: [
            ResumeService,
            {
              provide:
                  getRepositoryToken(Resume),
              useValue: resumeRepository,
            },
            {
              provide:
                  getRepositoryToken(Candidate),
              useValue: candidateRepository,
            },
          ],
        }).compile();

    service = module.get<ResumeService>(
        ResumeService,
    );

    jest.clearAllMocks();
  });

  describe('create', (): void => {
    it('should create and return a resume', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOneBy.mockResolvedValue(
          candidate,
      );

      resumeRepository.save.mockResolvedValue(
          resume,
      );

      // Act
      const result: Resume =
          await service.create(createDto);

      // Assert
      expect(result).toBe(resume);

      expect(
          candidateRepository.findOneBy,
      ).toHaveBeenCalledWith({
        id: createDto.candidateId,
      });

      expect(
          resumeRepository.save,
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
          resumeRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findAll', (): void => {
    it('should return all resumes with candidates', async (): Promise<void> => {
      // Arrange
      const resumes: Resume[] = [
        resume,
        {
          ...resume,
          id: 2,
          title: 'IT Support Specialist',
        } as Resume,
      ];

      resumeRepository.find.mockResolvedValue(
          resumes,
      );

      // Act
      const result: Resume[] =
          await service.findAll();

      // Assert
      expect(result).toEqual(resumes);
      expect(result).toHaveLength(2);

      expect(
          resumeRepository.find,
      ).toHaveBeenCalledWith({
        relations: {
          candidate: true,
        },
      });
    });
  });

  describe('findById', (): void => {
    it('should return resume by id', async (): Promise<void> => {
      // Arrange
      resumeRepository.findOne.mockResolvedValue(
          resume,
      );

      // Act
      const result: Resume =
          await service.findById(1);

      // Assert
      expect(result).toBe(resume);

      expect(
          resumeRepository.findOne,
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
        relations: {
          candidate: true,
        },
      });
    });

    it('should throw ResumeNotFoundException when resume does not exist', async (): Promise<void> => {
      // Arrange
      resumeRepository.findOne.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.findById(999),
      ).rejects.toBeInstanceOf(
          ResumeNotFoundException,
      );
    });
  });

  describe('update', (): void => {
    it('should update and return a resume', async (): Promise<void> => {
      // Arrange
      const updateDto: UpdateResumeDto = {
        title: 'AI Backend Developer',
        skills: [
          'TypeScript',
          'NestJS',
          'Jest',
        ],
        experience:
            'Backend and unit testing experience',
      };

      const updatedResume: Resume = {
        ...resume,
        ...updateDto,
      } as Resume;

      resumeRepository.findOne.mockResolvedValue({
        ...resume,
      } as Resume);

      resumeRepository.save.mockResolvedValue(
          updatedResume,
      );

      // Act
      const result: Resume =
          await service.update(1, updateDto);

      // Assert
      expect(result).toBe(updatedResume);

      expect(
          resumeRepository.save,
      ).toHaveBeenCalledWith(
          expect.objectContaining({
            title: updateDto.title,
            skills: updateDto.skills,
            experience: updateDto.experience,
          }),
      );
    });

    it('should throw CandidateNotFoundException when new candidate does not exist', async (): Promise<void> => {
      // Arrange
      const updateDto: UpdateResumeDto = {
        candidateId: 999,
      };

      resumeRepository.findOne.mockResolvedValue(
          resume,
      );

      candidateRepository.findOneBy.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.update(1, updateDto),
      ).rejects.toBeInstanceOf(
          CandidateNotFoundException,
      );

      expect(
          resumeRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('remove', (): void => {
    it('should remove an existing resume', async (): Promise<void> => {
      // Arrange
      resumeRepository.findOne.mockResolvedValue(
          resume,
      );

      resumeRepository.remove.mockResolvedValue(
          resume,
      );

      // Act
      await service.remove(1);

      // Assert
      expect(
          resumeRepository.remove,
      ).toHaveBeenCalledWith(resume);
    });
  });
});