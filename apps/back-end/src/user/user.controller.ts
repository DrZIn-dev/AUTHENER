import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from '../auth/auth.dto';
import { USER_ROLE } from '../pkg/dal/user-role/user-role.interface';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { Roles } from '../pkg/decorator/role.decorator';
import { User } from '../pkg/decorator/user.decorator';
import { JwtAuthGuard } from '../pkg/guard/jwt-auth.guard';
import { RolesGuard } from '../pkg/guard/roles.guard';
import { UpdateUserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/sign-up')
  @ApiOkResponse({ type: UserEntity })
  signUp(@Body() dto: SignUpDto) {
    return this.userService.create(dto);
  }

  @Post('/guest')
  @ApiOkResponse({ type: UserEntity })
  @Roles(...[USER_ROLE.ADMIN, USER_ROLE.USER])
  @UseGuards(JwtAuthGuard, RolesGuard)
  createGuest(@User() user: UserEntity) {
    return this.userService.createGuest(user);
  }

  @Get('/')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAll(@Query('skip') skip: string, @Query('limit') limit: string) {
    return this.userService.getAll(+skip, +limit);
  }

  @Get('/:id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  getOne(@Param('id') id: string) {
    return this.userService.getOne(id);
  }

  @Patch('/:id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateOne(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateOne(id, updateUserDto);
  }

  @Delete('/:id')
  @Roles(USER_ROLE.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  deleteOne(@Param('id') id: string) {
    console.log('call');
    return this.userService.deleteOne(id);
  }
}
