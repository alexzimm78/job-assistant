import {
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import {
    DataSource,
    Repository,
} from 'typeorm';

import { AppModule } from '../src/app.module';
import { Candidate } from '../src/candidate/candidate.entity';
import { Resume } from '../src/resume/resume.entity';

describe('ResumeController Integration Tests', () => {
    let app: INestApplication;
    let candidateRepository: Repository<Candidate>;
    let resumeRepository: Repository<Resume>;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule =
            await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        candidateRepository = moduleFixture.get<
            Repository<Candidate>
        >(getRepositoryToken(Candidate));

        resumeRepository = moduleFixture.get<
            Repository<Resume>
        >(getRepositoryToken(Resume));

        dataSource = moduleFixture.get(DataSource);

        await app.init();
    });

    beforeEach(async () => {
        await dataSource.query(`
            TRUNCATE TABLE
                applications,
                resumes,
                job_offers,
                candidates
            RESTART IDENTITY CASCADE
        `);
    });

    it('should create a resume and save it in the database', async () => {
        // Arrange
        const candidate =
            await candidateRepository.save({
                fullName: 'Alexander Zimmermann',
                email: 'alexander@example.com',
                phone: '+49123456789',
                city: 'Berlin',
            });

        const dto = {
            candidateId: candidate.id,
            title: 'AI Engineer Resume',
            skills: [
                'TypeScript',
                'NestJS',
                'PostgreSQL',
            ],
            experience: '2 years',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/resumes')
            .send(dto);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.candidateId).toBe(
            candidate.id,
        );
        expect(response.body.title).toBe(dto.title);
        expect(response.body.skills).toEqual(
            dto.skills,
        );
        expect(response.body.experience).toBe(
            dto.experience,
        );

        const savedResume =
            await resumeRepository.findOne({
                where: {
                    id: response.body.id,
                },
                relations: {
                    candidate: true,
                },
            });

        expect(savedResume).not.toBeNull();
        expect(savedResume?.candidate.id).toBe(
            candidate.id,
        );
        expect(savedResume?.title).toBe(dto.title);
    });

    it('should return an existing resume by id', async () => {
        // Arrange
        const candidate =
            await candidateRepository.save({
                fullName: 'Max Mustermann',
                email: 'max@example.com',
                phone: '+491701234567',
                city: 'Hamburg',
            });

        const resume = await resumeRepository.save({
            candidate,
            title: 'Backend Developer Resume',
            skills: ['TypeScript', 'NestJS'],
            experience: '3 years',
        });

        // Act
        const response = await request(
            app.getHttpServer(),
        ).get(`/resumes/${resume.id}`);

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(resume.id);
        expect(response.body.candidateId).toBe(
            candidate.id,
        );
        expect(response.body.title).toBe(
            resume.title,
        );
        expect(response.body.skills).toEqual(
            resume.skills,
        );
        expect(response.body.experience).toBe(
            resume.experience,
        );
    });

    it('should return 404 and not save a resume when candidate does not exist', async () => {
        // Arrange
        const dto = {
            candidateId: 999,
            title: 'AI Engineer Resume',
            skills: ['TypeScript', 'NestJS'],
            experience: '2 years',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/resumes')
            .send(dto);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toContain(
            '999',
        );

        const resumeCount =
            await resumeRepository.count();

        expect(resumeCount).toBe(0);
    });

    it('should return 400 and not save a resume when skills are empty', async () => {
        // Arrange
        const candidate =
            await candidateRepository.save({
                fullName: 'Anna Schmidt',
                email: 'anna@example.com',
                phone: '+491701112233',
                city: 'Potsdam',
            });

        const invalidDto = {
            candidateId: candidate.id,
            title: 'AI Engineer Resume',
            skills: [],
            experience: '2 years',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/resumes')
            .send(invalidDto);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBeInstanceOf(
            Array,
        );

        const resumeCount =
            await resumeRepository.count();

        expect(resumeCount).toBe(0);
    });

    afterAll(async () => {
        await app.close();
    });
});