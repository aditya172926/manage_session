import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/users.entity';
import { Repository } from 'typeorm';
import { Session } from '../models/sessions.entity';
import { randomUUID } from 'crypto';
import { EventsGateway } from '../events/events.gateway';
import { EventsService } from 'src/events/events.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Session)
        private sessionRepository: Repository<Session>,
        private eventsService: EventsService
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        return this.userRepository.findOne({ where: { id }, relations: { sessions: true } });
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

    async login(user: Partial<User>, ip: string, user_agent: string) {
        try {
            let userData = await this.userRepository.findOne({ where: { mobile: user.mobile } });
            const newSessionId = randomUUID();
            if (userData) {
                const updateUser = await this.update(userData.id, { activeSession: newSessionId });
                const updatePreviousSession = await this.sessionRepository.update(userData.activeSession, { valid: false });
            } else {
                const newuser = this.userRepository.create({
                    ...user,
                    activeSession: newSessionId
                });
                userData = await this.userRepository.save(newuser);
            }

            const session = {
                session_id: newSessionId,
                user_ip: ip,
                createdAt: Date.now().toString(),
                expiresAt: (Date.now() + 10000).toString(),
                user_agent,
                valid: true,
                user: userData
            }
            await this.sessionRepository.save(session);
            
            this.eventsService.sendMessage(userData.mobile, newSessionId);
            /**
             *TODO Check if the returned sessionId matches the localstorage sessionId.
             * If not, logout in the UI
             */
            return newSessionId;
        } catch (error: any) {
            console.log(error);
            throw new Error(JSON.stringify(error));
        }
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
