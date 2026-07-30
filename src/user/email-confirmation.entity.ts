import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity('email_confirmations')
export class EmailConfirmation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'uuid',
        unique: true,
    })
    code: string;

    @Column({
        type: 'timestamp',
    })
    expiresAt: Date;

    @ManyToOne(
        () => User,
        {
            nullable: false,
            onDelete: 'CASCADE',
        },
    )
    @JoinColumn({
        name: 'user_id',
    })
    user: User;
}