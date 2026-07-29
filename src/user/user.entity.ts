import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { UserRole } from './enums/user-role.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        unique: true,
    })
    login: string;

    @Column()
    passwordHash: string;

    @Column({
        type: 'varchar',
        nullable: true,
        select: false,
    })
    refreshTokenHash: string | null;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CANDIDATE,
    })
    role: UserRole;
}