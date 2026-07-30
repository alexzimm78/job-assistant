import {
    ConflictException,
    Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(
        dto: CreateUserDto,
    ): Promise<User> {
        const existingUser =
            await this.userRepository.findOne({
                where: {
                    login: dto.login,
                },
            });

        if (existingUser) {
            throw new ConflictException(
                'Benutzer mit diesem Login existiert bereits',
            );
        }

        const passwordHash: string =
            await bcrypt.hash(
                dto.password,
                10,
            );

        const user = this.userRepository.create({
            login: dto.login,
            passwordHash,
            role: dto.role,
        });

        return this.userRepository.save(user);
    }

    findByLogin(
        login: string,
    ): Promise<User | null> {
        return this.userRepository.findOne({
            where: {
                login,
            },
        });
    }

    findByEmail(
        email: string,
    ): Promise<User | null> {
        return this.userRepository.findOne({
            where: {
                email,
            },
        });
    }

    findById(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: {
                id,
            },
        });
    }

    async saveRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<void> {
        const refreshTokenHash =
            await bcrypt.hash(refreshToken, 10);

        await this.userRepository.update(
            userId,
            {
                refreshTokenHash,
            },
        );
    }

    async validateRefreshToken(
        userId: number,
        refreshToken: string,
    ): Promise<boolean> {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.refreshTokenHash')
            .where('user.id = :userId', {
                userId,
            })
            .getOne();

        if (!user?.refreshTokenHash) {
            return false;
        }

        return bcrypt.compare(
            refreshToken,
            user.refreshTokenHash,
        );
    }

    async clearRefreshToken(
        userId: number,
    ): Promise<void> {
        await this.userRepository.update(
            userId,
            {
                refreshTokenHash: null,
            },
        );
    }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}