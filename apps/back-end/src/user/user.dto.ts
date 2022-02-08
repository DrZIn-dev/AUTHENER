import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../pkg/dal/user/user.entity';

export class UpdateUserDto extends PickType(UserEntity, [
  'username',
  'email',
  'password',
] as const) {}
