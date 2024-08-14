import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'db',
    //   port: 5432,
    //   username: 'postgres',
    //   password: 'password',
    //   database: 'postgres',
    //   entities: [],
    //   synchronize: true,
    //   autoLoadEntities: true,
    // }),
    DatabaseModule,
    UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
