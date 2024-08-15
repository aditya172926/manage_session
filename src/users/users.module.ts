import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/users.entity';
import { Session } from '../models/sessions.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session]),
    EventsModule
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
