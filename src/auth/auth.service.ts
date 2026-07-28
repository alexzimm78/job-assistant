import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
    ) {}

    async authenticate(
        login: string,
        password: string,
    ): Promise<User> {
        const user =
            await this.userService.findByLogin(
                login,
            );

        if (!user) {
            throw new UnauthorizedException(
                'Ungültiger Login oder ungültiges Passwort',
            );
        }

        const passwordMatches: boolean =
            await bcrypt.compare(
                password,
                user.passwordHash,
            );

        if (!passwordMatches) {
            throw new UnauthorizedException(
                'Ungültiger Login oder ungültiges Passwort',
            );
        }

        return user;
    }
}