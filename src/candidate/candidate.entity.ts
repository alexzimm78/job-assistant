import { Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('candidates')
export class Candidate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column()
    phone: string;

    @Column()
    city: string;
}