import { Injectable } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Injectable()
export class EventsService {
    constructor(
        private eventsGateway: EventsGateway
    ) {}

    sendMessage(userTopic: string) {
        this.eventsGateway.server.emit(`${userTopic}`, {valid: false}, (data) => console.log(data))
    }
}
