import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { configService } from '../config/config.service';
import { USER_ROLE } from '../dal/user-role/user-role.interface';
import { UserSessionEntity } from '../dal/user-session/user-session.entity';
import { UserEntity } from '../dal/user/user.entity';

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  roles: USER_ROLE[];
}

export function jwtPayloadFactory(user: UserEntity): JwtPayload {
  return {
    username: user.username,
    email: user.email,
    id: user.id,
    roles: user.userRoles.map((userRole) => userRole.role),
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserSessionEntity)
    private userSessionRepository: Repository<UserSessionEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getJwtSecret(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
      relations: ['userRoles'],
    });
    if (!user) throw new UnauthorizedException('user_not_found.');

    const { authorization } = req.headers;
    const token = authorization.split(' ')[1];
    const userSession = await this.userSessionRepository.findOne({
      where: [{ accessToken: token }, { refreshToken: token }],
    });
    if (!userSession)
      throw new UnauthorizedException('user_session_not_found.');

    return user;
  }
}
