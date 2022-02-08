import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from '../pkg/dal/user-role/user-role.entity';
import { UserSessionEntity } from '../pkg/dal/user-session/user-session.entity';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { JwtStrategy } from '../pkg/strategy/jwt.strategy';
import { LocalStrategy } from '../pkg/strategy/local.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserSessionEntity, UserRoleEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
