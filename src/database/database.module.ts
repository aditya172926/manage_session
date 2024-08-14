import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/users.entity';
import { Session } from '../models/sessions.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async() => ({
                type: 'postgres',
                host: 'db',
                port: 5432,
                username: 'postgres',
                password: 'password',
                database: 'postgres',
                entities: [
                    User,
                    Session
                ],
                synchronize: true,
            })
        })
    ]
})
export class DatabaseModule {}
