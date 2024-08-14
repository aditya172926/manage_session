import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/users.entity';
import { Repository } from 'typeorm';
import { Session } from '../models/sessions.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne({ where: { id }, relations: { sessions: true} });
    }

    async signup(user: Partial<User>, ip: string, user_agent: string): Promise<User> {
        const sessionId = randomUUID();
        const newuser = this.userRepository.create({
            ...user,
            activeSession: sessionId
        });
        const response = await this.userRepository.save(newuser);
        console.log(response.id);
        console.log("sessionId ", sessionId);

        const newSession = {
            session_id: sessionId,
            user_ip: ip,
            createdAt: Date.now().toString(),
            expiresAt: Date.now().toString(),
            user_agent,
            valid: true,
            user: response
        };
        const saveSession = await this.createSession(newSession);
        console.log("New session ", saveSession);
        return response;
    }

    async login(user: Partial<User>, ip: string, user_agent: string, sessionId?: string) {
        const userData = await this.userRepository.findOne({where: {mobile: user.mobile}});
        let session: Session;
        if (sessionId) {
            session = await this.sessionRepository.findOne({
                where: {session_id: sessionId}
            });
            if (Date.now() > Number(session.expiresAt))
                return false;
        }
        const newSessionId = randomUUID();
        session = {
            session_id: newSessionId,
            user_ip: ip,
            createdAt: Date.now().toString(),
            expiresAt: Date.now().toString(),
            user_agent,
            valid: true,
            user: userData
        }
        // invalidate the previous active session
        await this.sessionRepository.save(session);
        const updateUser = await this.update(userData.id, {activeSession: newSessionId});
        const updatePreviousSession = await this.sessionRepository.update(updateUser.activeSession, {valid: false});
        return true;
    }

    private async createSession(session: Partial<Session>): Promise<boolean> {
        const response = await this.sessionRepository.save(session);
        console.log("New session ", response);
        if (response.session_id)
            return true;
        return false;
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

}
