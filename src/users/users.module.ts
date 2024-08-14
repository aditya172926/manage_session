import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/users.entity';
import { Session } from '../models/sessions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Session])
  ],
  providers: [UsersService],
  controllers: [UsersController]
})
export class UsersModule {}
