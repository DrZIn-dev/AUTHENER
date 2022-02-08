import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserEntity } from '../user/user.entity';
import { IUserRole, USER_ROLE } from './user-role.interface';

@Entity({ name: 'user_role' })
@Index(['role', 'user.id'], { unique: true })
export class UserRoleEntity extends BaseEntity implements IUserRole {
  constructor(partial: Partial<UserRoleEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @Column({ type: 'enum', enum: USER_ROLE })
  @Index('user_admin_unique', {
    where: '"role" = \'ADMIN\'',
    unique: true,
  })
  role: USER_ROLE;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
