import * as bcrypt from 'bcrypt';

import { DataSource } from 'typeorm';

import { UserRole } from '../src/user/enums/user-role.enum';
import { User } from '../src/user/user.entity';

export const TEST_LOGIN = 'test-admin';
export const TEST_PASSWORD = 'test-password';

export async function createTestAdmin(
    dataSource: DataSource,
): Promise<User> {
    const userRepository =
        dataSource.getRepository(User);

    const passwordHash =
        await bcrypt.hash(
            TEST_PASSWORD,
            10,
        );

    const user = userRepository.create({
        login: TEST_LOGIN,
        passwordHash,
        role: UserRole.ADMIN,
    });

    return userRepository.save(user);
}