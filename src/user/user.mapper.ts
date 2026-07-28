import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';

export class UserMapper {
    static toResponseDto(
        user: User,
    ): UserResponseDto {
        return {
            id: user.id,
            login: user.login,
            role: user.role,
        };
    }

    static toResponseDtoList(
        users: User[],
    ): UserResponseDto[] {
        return users.map((user) =>
            UserMapper.toResponseDto(user),
        );
    }
}