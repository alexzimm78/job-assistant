import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
    @ApiProperty({
        description: 'JWT Access Token для защищённых запросов',
    })
    accessToken: string;

    @ApiProperty({
        description: 'JWT Refresh Token для обновления Access Token',
    })
    refreshToken: string;
}