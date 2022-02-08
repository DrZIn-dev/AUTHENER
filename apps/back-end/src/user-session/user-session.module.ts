import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionEntity } from '../pkg/dal/user-session/user-session.entity';
import { UserSessionController } from './user-session.controller';
import { UserSessionService } from './user-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSessionEntity])],
  controllers: [UserSessionController],
  providers: [UserSessionService],
})
export class UserSessionModule {}
