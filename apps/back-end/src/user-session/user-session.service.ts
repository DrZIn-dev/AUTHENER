import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSessionEntity } from '../pkg/dal/user-session/user-session.entity';

@Injectable()
export class UserSessionService {
  constructor(
    @InjectRepository(UserSessionEntity)
    private userSession: Repository<UserSessionEntity>
  ) {}

  async getOne(id): Promise<UserSessionEntity> {
    const result = await this.userSession.findOne(id, { relations: ['user'] });
    return result;
  }

  async getAll(skip: number, limit: number): Promise<UserSessionEntity[]> {
    const result = await this.userSession.find({
      skip,
      take: limit,
      relations: ['user'],
    });
    return result;
  }

  async deleteOne(id: string): Promise<void> {
    await this.userSession.softDelete(id);
    return;
  }

  async deleteMany(userId: string): Promise<void> {
    await this.userSession.softDelete({ user: { id: userId } });
    return;
  }
}
