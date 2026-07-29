import {
    Body,
    Controller,
    Get,
    Post,
} from '@nestjs/common';

import {
ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserRole } from './enums/user-role.enum';
import { UserMapper } from './user.mapper';
import { UserService } from './user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Public()
    @Post()
    @ApiOperation({
        summary: 'Neuen Benutzer registrieren',
    })
    @ApiCreatedResponse({
        description:
            'Benutzer wurde erfolgreich registriert',
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