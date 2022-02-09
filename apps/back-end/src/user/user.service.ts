import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/auth.dto';
import { configService } from '../pkg/config/config.service';
import { UserRoleEntity } from '../pkg/dal/user-role/user-role.entity';
import { USER_ROLE } from '../pkg/dal/user-role/user-role.interface';
import { UserSessionEntity } from '../pkg/dal/user-session/user-session.entity';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
    @InjectRepository(UserSessionEntity)
    private userSessionRepository: Repository<UserSessionEntity>
  ) {}

  async create(dto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await bcryptjs.hash(
      dto.password,
      configService.getSaltRounds()
    );

    const user = this.userRepository.create();
    user.username = dto.username;
    user.email = dto.email;
    user.password = hashedPassword;
    const userRole = this.userRoleRepository.create();
    userRole.role = USER_ROLE.USER;
    user.userRoles = [userRole];
    const result = await this.userRepository.save(user).catch((error) => {
      throw new BadRequestException(error.message);
    });
    return Promise.resolve(result);
  }

  async getAll(skip: number, limit: number): Promise<UserEntity[]> {
    const result = await this.userRepository.find({
      skip,
      take: limit,
      relations: ['userRoles', 'userSessions'],
    });

    return result;
  }

  async getOne(id: string): Promise<UserEntity> {
    const result = await this.userRepository.findOne(id, {
      relations: ['userRoles', 'userSessions'],
    });
    return result;
  }

  async updateOne(id: string, updateUserDto: UpdateUserDto): Promise<void> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new BadRequestException('user_not_found');
    if (updateUserDto?.email) user.email = updateUserDto.email;
    if (updateUserDto?.username) user.username = updateUserDto.username;
    if (updateUserDto?.password) {
      //? hashed password
      const hashedPassword = await bcryptjs.hash(
        updateUserDto.password,
        configService.getSaltRounds()
      );
      user.password = hashedPassword;

      //? delete all user session
      await this.userSessionRepository.softDelete({ user: { id } });
    }
    await this.userRepository.save(user);
    return;
  }

  async deleteOne(userId): Promise<void> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['userRoles', 'userSessions'],
    });
    await this.userRepository.softRemove(user);
    return;
  }
}