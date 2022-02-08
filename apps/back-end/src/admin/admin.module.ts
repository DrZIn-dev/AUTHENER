import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoleEntity } from '../pkg/dal/user-role/user-role.entity';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserRoleEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
