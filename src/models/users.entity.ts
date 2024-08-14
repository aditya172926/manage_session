import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn,  } from "typeorm";
import { Session } from "./sessions.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    mobile: string;

    @Column()
    username: string;

    @Column()
    activeSession: string;

    @OneToMany(() => Session, (session) => session.user)
    sessions: Session[];
}