import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./users.entity";

@Entity()
export class Session {
    @PrimaryColumn()
    session_id: string;

    @Column()
    user_ip: string;

    @Column()
    createdAt: string;

    @Column()
    expiresAt: string;

    @Column()
    valid: boolean;

    @Column()
    user_agent: string;

    @ManyToOne(() => User, (user) => user.sessions)
    user: User
}