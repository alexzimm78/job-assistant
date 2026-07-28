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

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }
}