import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { configService } from '../pkg/config/config.service';
import { UserSessionEntity } from '../pkg/dal/user-session/user-session.entity';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { JwtPayload, jwtPayloadFactory } from '../pkg/strategy/jwt.strategy';
import { SessionDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserSessionEntity)
    private userSessionRepository: Repository<UserSessionEntity>,
    private jwtService: JwtService
  ) {}

  async signIn(user: UserEntity): Promise<SessionDto> {
    const payload: JwtPayload = jwtPayloadFactory(user);
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: configService.getAccessTokenLife(),
    });
    const refreshToken = await this.jwtService.sign(payload, {
      expiresIn: configService.getRefreshTokenLife(),
    });
    const userSession = this.userSessionRepository.create();
    userSession.user = user;
    userSession.accessToken = accessToken;
    userSession.refreshToken = refreshToken;
    await this.userSessionRepository.save(userSession);

    const result = {
      accessToken,
      refreshToken,
    };
    return result;
  }

  async refreshAccessToken(
    user: UserEntity,
    refreshToken: string
  ): Promise<SessionDto> {
    const userSession = await this.userSessionRepository.findOne({
      refreshToken,
    });
    if (!userSession) throw new NotFoundException('session_not_found.');
    const payload: JwtPayload = jwtPayloadFactory(user);
    const accessToken = await this.jwtService.sign(payload, {
      expiresIn: configService.getAccessTokenLife(),
    });
    userSession.accessToken = accessToken;
    await this.userSessionRepository.save(userSession);

    const result = {
      accessToken,
      refreshToken,
    };
    return result;
  }

  async removeSession(accessToken: string): Promise<void> {
    await this.userSessionRepository.softDelete({ accessToken });
    return;
  }
}
