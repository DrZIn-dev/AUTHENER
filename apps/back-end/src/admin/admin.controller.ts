import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpDto } from '../auth/auth.dto';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { AdminService } from './admin.service';

@Controller('admin')
@ApiTags('admin')
@UseInterceptors(ClassSerializerInterceptor)
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('/sign-up')
  @ApiOkResponse({ type: UserEntity })
  signUp(@Body() dto: SignUpDto) {
    return this.adminService.create(dto);
  }
}
