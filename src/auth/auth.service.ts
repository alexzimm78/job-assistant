import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

import { LoginRequestDto } from './dto/login-request.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { TokensService } from './tokens.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokensService: TokensService,
    ) {}

    async authenticate(
        login: string,
        password: string,
    ): Promise<User> {
        const user =
            await this.userService.findByLogin(login);

        if (!user) {
            throw new UnauthorizedException(
                'Ungültiger Login oder ungültiges Passwort',
            );
        }

        const passwordMatches =
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

    async login(
        dto: LoginRequestDto,
    ): Promise<TokensResponseDto> {
        const user = await this.authenticate(
            dto.login,
            dto.password,
        );

        const payload: TokenPayload = {
            sub: user.id,
            login: user.login,
            role: user.role,
        };

        const tokens =
            this.tokensService.createTokens(payload);

        await this.userService.saveRefreshToken(
            user.id,
            tokens.refreshToken,
        );

        return tokens;
    }

    async refresh(
        refreshToken: string,
    ): Promise<TokensResponseDto> {
        const payload =
            this.tokensService.verifyRefreshToken(
                refreshToken,
            );

        const refreshTokenIsValid =
            await this.userService.validateRefreshToken(
                payload.sub,
                refreshToken,
            );

        if (!refreshTokenIsValid) {
            throw new UnauthorizedException(
                'Refresh Token ist ungültig',
            );
        }

        const user =
            await this.userService.findById(
                payload.sub,
            );

        if (!user) {
            throw new UnauthorizedException(
                'Benutzer wurde nicht gefunden',
            );
        }

        const newPayload: TokenPayload = {
            sub: user.id,
            login: user.login,
            role: user.role,
        };

        const newTokens =
            this.tokensService.createTokens(
                newPayload,
            );

        await this.userService.saveRefreshToken(
            user.id,
            newTokens.refreshToken,
        );

        return newTokens;
    }

    async logout(
        refreshToken: string,
    ): Promise<void> {
        const payload =
            this.tokensService.verifyRefreshToken(
                refreshToken,
            );

        const refreshTokenIsValid =
            await this.userService.validateRefreshToken(
                payload.sub,
                refreshToken,
            );

        if (!refreshTokenIsValid) {
            throw new UnauthorizedException(
                'Refresh Token ist ungültig',
            );
        }

        await this.userService.clearRefreshToken(
            payload.sub,
        );
    }
}