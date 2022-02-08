import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../base/base.entity';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { UserSessionEntity } from '../user-session/user-session.entity';
import { IUser } from './user.interface';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
  constructor(partial: Partial<UserEntity>) {
    super(partial);
    Object.assign(this, partial);
  }

  // swagger
  @ApiProperty()
  // validate
  @IsString()
  @IsNotEmpty()
  //typeorm
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;

  // swagger
  @ApiProperty()
  // validate
  @IsString()
  @IsNotEmpty()
  //typeorm
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  // swagger
  @ApiProperty({ writeOnly: true })
  // validate
  @IsString()
  @IsNotEmpty()
  // serialize
  @Exclude({ toPlainOnly: true })
  //typeorm
  @Column({ type: 'text' })
  password: string;

  @OneToMany(() => UserSessionEntity, (userSession) => userSession.user, {
    cascade: ['soft-remove', 'insert', 'update'],
  })
  userSessions: UserSessionEntity[];

  @Transform(({ value }) =>
    (value as UserRoleEntity[]).map((userRole) => userRole.role)
  )
  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user, {
    cascade: ['soft-remove', 'insert', 'update'],
  })
  userRoles: UserRoleEntity[];
}
