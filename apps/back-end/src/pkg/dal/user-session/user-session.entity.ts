import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserEntity } from '../user/user.entity';
import { IUserSession } from './user-session.interface';

@Entity({ name: 'user_session' })
export class UserSessionEntity extends BaseEntity implements IUserSession {
  constructor(partial: Partial<UserSessionEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ApiProperty()
  @Column({ name: 'access_token', type: 'text' })
  @Exclude()
  accessToken: string;

  @ApiProperty()
  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  @Exclude()
  refreshToken: string;
}
