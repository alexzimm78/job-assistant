import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';

import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class TokensService {
    constructor(
        private readonly configService: ConfigService,
    ) {}

    createAccessToken(payload: TokenPayload): string {
        const secret =
            this.configService.getOrThrow<string>(
                'JWT_ACCESS_SECRET',
            );

        const expiresIn =
            this.configService.get<string>(
                'JWT_ACCESS_EXPIRES_IN',
                '15m',
            ) as SignOptions['expiresIn'];

        return jwt.sign(payload, secret, {
            expiresIn,
        });
    }

    createRefreshToken(payload: TokenPayload): string {
        const secret =
            this.configService.getOrThrow<string>(
                'JWT_REFRESH_SECRET',
            );

        const expiresIn =
            this.configService.get<string>(
                'JWT_REFRESH_EXPIRES_IN',
                '7d',
            ) as SignOptions['expiresIn'];

        return jwt.sign(payload, secret, {
            expiresIn,
        });
    }

    verifyAccessToken(token: string): TokenPayload {
        const secret =
            this.configService.getOrThrow<string>(
                'JWT_ACCESS_SECRET',
            );

        try {
            return jwt.verify(
                token,
                secret,
            ) as unknown as TokenPayload;
        } catch {
            throw new UnauthorizedException(
                'Access Token ist ungültig oder abgelaufen',
            );
        }
    }

    verifyRefreshToken(token: string): TokenPayload {
        const secret =
            this.configService.getOrThrow<string>(
                'JWT_REFRESH_SECRET',
            );

        try {
            return jwt.verify(
                token,
                secret,
            ) as unknown as TokenPayload;
        } catch {
            throw new UnauthorizedException(
                'Refresh Token ist ungültig oder abgelaufen',
            );
        }
    }

    createTokens(payload: TokenPayload): {
        accessToken: string;
        refreshToken: string;
    } {
        return {
            accessToken:
                this.createAccessToken(payload),
            refreshToken:
                this.createRefreshToken(payload),
        };
    }
}