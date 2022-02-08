import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/auth.dto';
import { configService } from '../pkg/config/config.service';
import { UserRoleEntity } from '../pkg/dal/user-role/user-role.entity';
import { USER_ROLE } from '../pkg/dal/user-role/user-role.interface';
import { UserEntity } from '../pkg/dal/user/user.entity';
@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>
  ) {}
  async create(dto: SignUpDto): Promise<UserEntity> {
    const hashedPassword = await bcryptjs.hash(
      dto.password,
      configService.getSaltRounds()
    );

    const adminUserRole = await this.userRoleRepository.count({
      where: { role: USER_ROLE.ADMIN },
    });
    if (adminUserRole !== 0)
      throw new BadRequestException('admin_account_already_exists');

    const user = this.userRepository.create();
    user.username = dto.username;
    user.email = dto.email;
    user.password = hashedPassword;
    const userRole = this.userRoleRepository.create();
    userRole.role = USER_ROLE.ADMIN;
    user.userRoles = [userRole];
    const result = await this.userRepository.save(user).catch((error) => {
      throw new BadRequestException(error.message);
    });
    return Promise.resolve(result);
  }
}
