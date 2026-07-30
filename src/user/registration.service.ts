import {
    BadRequestException,
    ConflictException,
    Injectable,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import { EmailService } from '../email/email.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailConfirmation } from './email-confirmation.entity';
import { UserRole } from './enums/user-role.enum';
import { User } from './user.entity';
import { UserService } from './user.service';

@Injectable()
export class RegistrationService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(EmailConfirmation)
        private readonly confirmationRepository:
        Repository<EmailConfirmation>,

        private readonly userService: UserService,
        private readonly emailService: EmailService,
    ) {}

    async register(
        dto: RegisterUserDto,
    ): Promise<{ message: string }> {
        const email = dto.email
            .trim()
            .toLowerCase();

        const login = dto.login.trim();

        let user =
            await this.userService.findByEmail(email);

        if (user?.isActive) {
            throw new ConflictException(
                'Der Benutzer ist bereits registriert',
            );
        }

        const userWithLogin =
            await this.userService.findByLogin(login);

        if (
            userWithLogin &&
            userWithLogin.id !== user?.id
        ) {
            throw new ConflictException(
                'Ein Benutzer mit diesem Login existiert bereits',
            );
        }

        const passwordHash =
            await bcrypt.hash(dto.password, 10);

        if (!user) {
            user = this.userRepository.create({
                login,
                email,
                passwordHash,
                role: UserRole.CANDIDATE,
                isActive: false,
            });
        } else {
            user.login = login;
            user.email = email;
            user.passwordHash = passwordHash;
            user.isActive = false;
        }

        user = await this.userRepository.save(user);

        await this.confirmationRepository.delete({
            user: {
                id: user.id,
            },
        });

        const code = randomUUID();

        const expiresAt = new Date(
            Date.now() + 24 * 60 * 60 * 1000,
        );

        const confirmation =
            this.confirmationRepository.create({
                code,
                expiresAt,
                user,
            });

        await this.confirmationRepository.save(
            confirmation,
        );

        await this.emailService
            .sendRegistrationConfirmation(
                email,
                code,
            );

        return {
            message:
                'Die Registrierung wurde gespeichert. Bitte bestätigen Sie Ihre E-Mail-Adresse.',
        };
    }

    async confirmEmail(
        code: string,
    ): Promise<{ message: string }> {
        const confirmation =
            await this.confirmationRepository.findOne({
                where: {
                    code,
                },
                relations: {
                    user: true,
                },
            });

        if (!confirmation) {
            throw new BadRequestException(
                'Der Bestätigungscode ist ungültig',
            );
        }

        if (
            confirmation.expiresAt.getTime() <
            Date.now()
        ) {
            await this.confirmationRepository.remove(
                confirmation,
            );

            throw new BadRequestException(
                'Der Bestätigungscode ist abgelaufen',
            );
        }

        confirmation.user.isActive = true;

        await this.userRepository.save(
            confirmation.user,
        );

        await this.confirmationRepository.remove(
            confirmation,
        );

        return {
            message:
                'Die E-Mail-Adresse wurde erfolgreich bestätigt. Das Benutzerkonto ist jetzt aktiv.',
        };
    }
}