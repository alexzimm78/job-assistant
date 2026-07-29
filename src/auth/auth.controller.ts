import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import {
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { LoginRequestDto } from './dto/login-request.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token-request.dto';
import { TokensResponseDto } from './dto/tokens-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Benutzer anmelden',
    })
    @ApiOkResponse({
        description:
            'Anmeldung erfolgreich',
        type: TokensResponseDto,
    })
    @ApiUnauthorizedResponse({
        description:
            'Login oder Passwort ist ungültig',
    })
    login(
        @Body() dto: LoginRequestDto,
    ): Promise<TokensResponseDto> {
        return this.authService.login(dto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Access Token aktualisieren',
    })
    @ApiOkResponse({
        description:
            'Neue JWT-Tokens wurden erstellt',
        type: TokensResponseDto,
    })
    @ApiUnauthorizedResponse({
        description:
            'Refresh Token ist ungültig oder abgelaufen',
    })
    refresh(
        @Body() dto: RefreshTokenRequestDto,
    ): Promise<TokensResponseDto> {
        return this.authService.refresh(
            dto.refreshToken,
        );
    }

    @Public()
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Benutzer abmelden',
    })
    @ApiOkResponse({
        description:
            'Abmeldung erfolgreich',
    })
    async logout(
        @Body() dto: RefreshTokenRequestDto,
    ): Promise<{ message: string }> {
        await this.authService.logout(
            dto.refreshToken,
        );

        return {
            message:
                'Abmeldung erfolgreich',
        };
    }
}