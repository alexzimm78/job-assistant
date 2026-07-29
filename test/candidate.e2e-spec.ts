import {
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import request from 'supertest';
import {
    DataSource,
    Repository,
} from 'typeorm';

import {AppModule} from '../src/app.module';
import {Candidate} from '../src/candidate/candidate.entity';
import {
    createTestAdmin,
    loginTestAdmin,
} from './auth-test.helper';

describe('CandidateController Integration Tests', () => {
    let app: INestApplication;
    let candidateRepository: Repository<Candidate>;
    let dataSource: DataSource;
    let accessToken: string;

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

        dataSource = moduleFixture.get(DataSource);

        await app.init();
    });

    beforeEach(async () => {
        await dataSource.query(`
        TRUNCATE TABLE
            applications,
            resumes,
            job_offers,
            candidates,
            users
        RESTART IDENTITY CASCADE
    `);

        await createTestAdmin(dataSource);
        accessToken =
            await loginTestAdmin(app);
    });

    it('should create a candidate and save it in the database', async () => {
        // Arrange
        const dto = {
            fullName: 'Alexander Zimmermann',
            email: 'alexander@example.com',
            phone: '+49123456789',
            city: 'Berlin',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/candidates')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )
            .send(dto);



        // Assert
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.fullName).toBe(dto.fullName);
        expect(response.body.email).toBe(dto.email);
        expect(response.body.city).toBe(dto.city);

        const savedCandidate =
            await candidateRepository.findOne({
                where: {
                    email: dto.email,
                },
            });

        expect(savedCandidate).not.toBeNull();
        expect(savedCandidate?.fullName).toBe(
            dto.fullName,
        );
        expect(savedCandidate?.phone).toBe(dto.phone);
    });

    it('should return an existing candidate by id', async () => {
        // Arrange
        const candidate =
            await candidateRepository.save({
                fullName: 'Max Mustermann',
                email: 'max@example.com',
                phone: '+491701234567',
                city: 'Hamburg',
            });

        // Act
        const response = await request(
            app.getHttpServer(),
        ).get(`/candidates/${candidate.id}`)
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(candidate.id);
        expect(response.body.fullName).toBe(
            candidate.fullName,
        );
        expect(response.body.email).toBe(
            candidate.email,
        );
        expect(response.body.city).toBe(
            candidate.city,
        );
    });

    it('should return 400 and not save a candidate when email is invalid', async () => {
        // Arrange
        const invalidDto = {
            fullName: 'Alexander Zimmermann',
            email: 'keine-gueltige-email',
            phone: '+49123456789',
            city: 'Berlin',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/candidates')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )
            .send(invalidDto);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBeInstanceOf(
            Array,
        );

        const candidateCount =
            await candidateRepository.count();

        expect(candidateCount).toBe(0);
    });

    it('should return 409 and not create a duplicate candidate', async () => {
        // Arrange
        const existingCandidate =
            await candidateRepository.save({
                fullName: 'Alexander Zimmermann',
                email: 'duplicate@example.com',
                phone: '+49123456789',
                city: 'Berlin',
            });

        const duplicateDto = {
            fullName: 'Another Candidate',
            email: existingCandidate.email,
            phone: '+491701112233',
            city: 'Potsdam',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/candidates')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )
            .send(duplicateDto);

        // Assert
        expect(response.status).toBe(409);
        expect(response.body.statusCode).toBe(409);
        expect(response.body.message).toContain(
            existingCandidate.email,
        );

        const candidates =
            await candidateRepository.find();

        expect(candidates).toHaveLength(1);
        expect(candidates[0].fullName).toBe(
            existingCandidate.fullName,
        );
    });

    afterAll(async () => {
        await app.close();
    });
});