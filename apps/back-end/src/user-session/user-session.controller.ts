import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { USER_ROLE } from '../pkg/dal/user-role/user-role.interface';
import { Roles } from '../pkg/decorator/role.decorator';
import { JwtAuthGuard } from '../pkg/guard/jwt-auth.guard';
import { RolesGuard } from '../pkg/guard/roles.guard';
import { UserSessionService } from './user-session.service';

@Controller('user-sessions')
@UseInterceptors(ClassSerializerInterceptor)
@Roles(USER_ROLE.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserSessionController {
  constructor(private userSessionService: UserSessionService) {}

  @Get('/')
  getAll(@Query('skip') skip: string, @Query('limit') limit: string) {
    return this.userSessionService.getAll(+skip, +limit);
  }

  @Get('/:id')
  getOne(@Param('id') id: string) {
    return this.userSessionService.getOne(id);
  }

  @Delete('/')
  deleteMany(@Query('user_id') userId: string) {
    return this.userSessionService.deleteMany(userId);
  }

  @Delete('/:id')
  deleteOne(@Param('id') id: string) {
    return this.userSessionService.deleteOne(id);
  }
}
