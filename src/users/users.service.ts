import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { EventsService } from 'src/events/events.service';
import { Repository } from 'typeorm';
import { Session } from '../models/sessions.entity';
import { User } from '../models/users.entity';

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

    async login(user: Partial<User>, ip: string, user_agent: string) {
        try {
            let userData = await this.userRepository.findOne({ where: { mobile: user.mobile } });
            const oldSessionId = userData?.activeSession;
            const newSessionId = randomUUID();
            if (userData) {
                await this.update(userData.id, { activeSession: newSessionId });
                await this.sessionRepository.update(userData.activeSession, { valid: false });
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
            
            if (oldSessionId)
                this.eventsService.sendMessage(oldSessionId);
            return newSessionId;
        } catch (error: any) {
            console.log("Error", error);
            throw new Error(JSON.stringify(error));
        }
    }

    private async update(id: string, user: Partial<User>): Promise<User> {
        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { id } });
    }

}
