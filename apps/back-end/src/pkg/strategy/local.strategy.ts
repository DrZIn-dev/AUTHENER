import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Strategy } from 'passport-local';
import { Repository } from 'typeorm';
import { UserEntity } from '../dal/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email: username }],
      relations: ['userRoles'],
    });
    if (!user) throw new NotFoundException('user_not_found.');
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('username_or_password_invalid');
    return user;
  }
}
