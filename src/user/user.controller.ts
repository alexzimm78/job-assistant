import {
    Body,
    Controller,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
} from '@nestjs/common';

import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from './enums/user-role.enum';
import { RegistrationService } from './registration.service';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly registrationService:
        RegistrationService,
    ) {}

    @Public()
    @Post('register')
    @ApiOperation({
        summary:
            'Benutzer mit E-Mail-Bestätigung registrieren',
    })
    @ApiCreatedResponse({
        description:
            'Registrierung wurde gespeichert und die Bestätigungs-E-Mail wurde versendet',
    })
    @ApiConflictResponse({
        description:
            'Login ist vergeben oder der Benutzer ist bereits registriert',
    })
    register(
        @Body() dto: RegisterUserDto,
    ): Promise<{ message: string }> {
        return this.registrationService.register(dto);
    }

    @Public()
    @Get('confirm/:code')
    @ApiOperation({
        summary:
            'E-Mail-Adresse bestätigen und Benutzerkonto aktivieren',
    })
    @ApiParam({
        name: 'code',
        description:
            'Einmaliger UUID-Bestätigungscode',
        example:
            '550e8400-e29b-41d4-a716-446655440000',
    })
    @ApiOkResponse({
        description:
            'Benutzerkonto wurde erfolgreich aktiviert',
    })
    @ApiBadRequestResponse({
        description:
            'Bestätigungscode ist ungültig oder abgelaufen',
    })
    confirmEmail(
        @Param(
            'code',
            new ParseUUIDPipe({
                version: '4',
            }),
        )
        code: string,
    ): Promise<{ message: string }> {
        return this.registrationService
            .confirmEmail(code);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary:
            'Neuen Benutzer durch einen Administrator erstellen',
    })
    @ApiCreatedResponse({
        description:
            'Benutzer wurde erfolgreich erstellt',
        type: UserResponseDto,
    })
    @ApiConflictResponse({
        description:
            'Benutzer mit diesem Login existiert bereits',
    })
    async create(
        @Body() dto: CreateUserDto,
    ): Promise<UserResponseDto> {
        const user =
            await this.userService.create(dto);

        return UserMapper.toResponseDto(user);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiBearerAuth('access-token')
    @ApiOperation({
        summary: 'Alle Benutzer abrufen',
    })
    @ApiOkResponse({
        description: 'Liste aller Benutzer',
        type: UserResponseDto,
        isArray: true,
    })
    async findAll(): Promise<UserResponseDto[]> {
        const users =
            await this.userService.findAll();

        return UserMapper.toResponseDtoList(users);
    }
}