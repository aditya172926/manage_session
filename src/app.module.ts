import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { EventsGateway } from './events/events.gateway';
import { EventsService } from './events/events.service';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    EventsModule
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway, EventsService],
})
export class AppModule { }
