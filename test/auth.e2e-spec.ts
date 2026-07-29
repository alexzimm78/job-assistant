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
import { UserRole } from '../src/user/enums/user-role.enum';
import { User } from '../src/user/user.entity';

import {
    createTestAdmin,
    TEST_LOGIN,
    TEST_PASSWORD,
} from './auth-test.helper';

describe('JWT Authentication and Authorization Tests', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let userRepository: Repository<User>;

    beforeAll(async () => {
        const moduleFixture: TestingModule =
            await Test.createTestingModule({
                imports: [
                    AppModule,
                ],
            }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        dataSource =
            moduleFixture.get(DataSource);

        userRepository = moduleFixture.get<
            Repository<User>
        >(getRepositoryToken(User));

        await app.init();
    });

    beforeEach(async () => {
        await dataSource.query(`
            TRUNCATE TABLE users
            RESTART IDENTITY CASCADE
        `);
    });

    it('should create a user through public endpoint', async () => {
        const dto = {
            login: 'candidate',
            password: 'candidate123',
            role: UserRole.CANDIDATE,
        };

        const response = await request(
            app.getHttpServer(),
        )
            .post('/users')
            .send(dto);

        expect(response.status).toBe(201);
        expect(response.body.login).toBe(dto.login);
        expect(response.body.role).toBe(dto.role);
        expect(response.body.password).toBeUndefined();
        expect(
            response.body.passwordHash,
        ).toBeUndefined();

        const savedUser =
            await userRepository.findOne({
                where: {
                    login: dto.login,
                },
            });

        expect(savedUser).not.toBeNull();
        expect(
            savedUser?.passwordHash,
        ).toBeDefined();
        expect(
            savedUser?.passwordHash,
        ).not.toBe(dto.password);
    });

    it('should login and return JWT tokens', async () => {
        await createTestAdmin(dataSource);

        const response = await request(
            app.getHttpServer(),
        )
            .post('/auth/login')
            .send({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            });

        expect(response.status).toBe(200);
        expect(
            response.body.accessToken,
        ).toEqual(expect.any(String));
        expect(
            response.body.refreshToken,
        ).toEqual(expect.any(String));
    });

    it('should return 401 without Access Token', async () => {
        const response = await request(
            app.getHttpServer(),
        ).get('/users');

        expect(response.status).toBe(401);
    });

    it('should return 401 for incorrect password', async () => {
        await createTestAdmin(dataSource);

        const response = await request(
            app.getHttpServer(),
        )
            .post('/auth/login')
            .send({
                login: TEST_LOGIN,
                password: 'wrong-password',
            });

        expect(response.status).toBe(401);
        expect(
            response.body.accessToken,
        ).toBeUndefined();
        expect(
            response.body.refreshToken,
        ).toBeUndefined();
    });

    it('should return 403 for a candidate', async () => {
        await request(
            app.getHttpServer(),
        )
            .post('/users')
            .send({
                login: 'candidate',
                password: 'candidate123',
                role: UserRole.CANDIDATE,
            })
            .expect(201);

        const loginResponse = await request(
            app.getHttpServer(),
        )
            .post('/auth/login')
            .send({
                login: 'candidate',
                password: 'candidate123',
            })
            .expect(200);

        const accessToken =
            loginResponse.body.accessToken as string;

        const response = await request(
            app.getHttpServer(),
        )
            .get('/users')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            );

        expect(response.status).toBe(403);
    });

    it('should allow access for an admin', async () => {
        await createTestAdmin(dataSource);

        const loginResponse = await request(
            app.getHttpServer(),
        )
            .post('/auth/login')
            .send({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            })
            .expect(200);

        const accessToken =
            loginResponse.body.accessToken as string;

        const response = await request(
            app.getHttpServer(),
        )
            .get('/users')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            );

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].role).toBe(
            UserRole.ADMIN,
        );
    });

    it('should refresh JWT tokens', async () => {
        await createTestAdmin(dataSource);

        const loginResponse = await request(
            app.getHttpServer(),
        )
            .post('/auth/login')
            .send({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            })
            .expect(200);

        const refreshToken =
            loginResponse.body.refreshToken as string;

        const response = await request(
            app.getHttpServer(),
        )
            .post('/auth/refresh')
            .send({
                refreshToken,
            });

        expect(response.status).toBe(200);
        expect(
            response.body.accessToken,
        ).toEqual(expect.any(String));
        expect(
            response.body.refreshToken,
        ).toEqual(expect.any(String));
    });

    it('should reject Refresh Token after logout', async () => {
        await createTestAdmin(dataSource);

        const loginResponse = await request(
            app.getHttpServer(),
        )
            .post('/auth/login')
            .send({
                login: TEST_LOGIN,
                password: TEST_PASSWORD,
            })
            .expect(200);

        const refreshToken =
            loginResponse.body.refreshToken as string;

        const logoutResponse = await request(
            app.getHttpServer(),
        )
            .post('/auth/logout')
            .send({
                refreshToken,
            });

        expect(logoutResponse.status).toBe(200);
        expect(logoutResponse.body.message).toBe(
            'Abmeldung erfolgreich',
        );

        const refreshResponse = await request(
            app.getHttpServer(),
        )
            .post('/auth/refresh')
            .send({
                refreshToken,
            });

        expect(refreshResponse.status).toBe(401);
    });

    afterAll(async () => {
        await app.close();
    });
});