import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from './candidate.entity';
import { CandidateService } from './candidate.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateAlreadyExistsException } from './exceptions/candidate-already-exists.exception';
import { CandidateNotFoundException } from './exceptions/candidate-not-found.exception';

describe('CandidateService', (): void => {
  let service: CandidateService;
  let candidateRepository: jest.Mocked<
      Pick<
          Repository<Candidate>,
          'findOne' | 'find' | 'save' | 'merge' | 'remove'
      >
  >;

  const candidate: Candidate = {
    id: 1,
    fullName: 'Alexander Zimmermann',
    email: 'alex@example.com',
    phone: '+49123456789',
    city: 'Berlin',
  } as Candidate;

  const createDto: CreateCandidateDto = {
    fullName: 'Alexander Zimmermann',
    email: 'alex@example.com',
    phone: '+49123456789',
    city: 'Berlin',
  };

  beforeEach(async (): Promise<void> => {
    candidateRepository = {
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule =
        await Test.createTestingModule({
          providers: [
            CandidateService,
            {
              provide: getRepositoryToken(Candidate),
              useValue: candidateRepository,
            },
          ],
        }).compile();

    service = module.get<CandidateService>(
        CandidateService,
    );

    jest.clearAllMocks();
  });

  describe('create', (): void => {
    it('should create and return a new candidate', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOne.mockResolvedValue(
          null,
      );
      candidateRepository.save.mockResolvedValue(
          candidate,
      );

      // Act
      const result: Candidate =
          await service.create(createDto);

      // Assert
      expect(result).toBe(candidate);

      expect(
          candidateRepository.findOne,
      ).toHaveBeenCalledWith({
        where: {
          email: createDto.email,
        },
      });

      expect(
          candidateRepository.save,
      ).toHaveBeenCalled();
    });

    it('should throw CandidateAlreadyExistsException when email already exists', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOne.mockResolvedValue(
          candidate,
      );

      // Act and Assert
      await expect(
          service.create(createDto),
      ).rejects.toBeInstanceOf(
          CandidateAlreadyExistsException,
      );

      expect(
          candidateRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('findAll', (): void => {
    it('should return all candidates', async (): Promise<void> => {
      // Arrange
      const candidates: Candidate[] = [
        candidate,
        {
          ...candidate,
          id: 2,
          email: 'monika@example.com',
        } as Candidate,
      ];

      candidateRepository.find.mockResolvedValue(
          candidates,
      );

      // Act
      const result: Candidate[] =
          await service.findAll();

      // Assert
      expect(result).toEqual(candidates);
      expect(result).toHaveLength(2);

      expect(
          candidateRepository.find,
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('findById', (): void => {
    it('should return candidate by id', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOne.mockResolvedValue(
          candidate,
      );

      // Act
      const result: Candidate =
          await service.findById(1);

      // Assert
      expect(result).toBe(candidate);

      expect(
          candidateRepository.findOne,
      ).toHaveBeenCalledWith({
        where: {
          id: 1,
        },
      });
    });

    it('should throw CandidateNotFoundException when candidate does not exist', async (): Promise<void> => {
      // Arrange
      candidateRepository.findOne.mockResolvedValue(
          null,
      );

      // Act and Assert
      await expect(
          service.findById(999),
      ).rejects.toBeInstanceOf(
          CandidateNotFoundException,
      );
    });
  });

  describe('update', (): void => {
    it('should throw CandidateAlreadyExistsException when new email already belongs to another candidate', async (): Promise<void> => {
      // Arrange
      const updateDto: UpdateCandidateDto = {
        email: 'existing@example.com',
      };

      const existingCandidate: Candidate = {
        ...candidate,
        id: 2,
        email: 'existing@example.com',
      } as Candidate;

      candidateRepository.findOne
          .mockResolvedValueOnce(candidate)
          .mockResolvedValueOnce(existingCandidate);

      // Act and Assert
      await expect(
          service.update(1, updateDto),
      ).rejects.toBeInstanceOf(
          CandidateAlreadyExistsException,
      );

      expect(
          candidateRepository.merge,
      ).not.toHaveBeenCalled();

      expect(
          candidateRepository.save,
      ).not.toHaveBeenCalled();
    });
  });
});