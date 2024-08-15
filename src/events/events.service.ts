import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
    constructor(
        private eventsGateway: EventsGateway
    ) {}

    sendMessage(userTopic: string, sessionId: string) {
        this.eventsGateway.server.emit(`${userTopic}`, {sessionId: sessionId}, (data) => console.log(data))
    }
}
