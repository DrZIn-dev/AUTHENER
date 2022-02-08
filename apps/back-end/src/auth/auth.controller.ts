import {
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UserEntity } from '../pkg/dal/user/user.entity';
import { User } from '../pkg/decorator/user.decorator';
import { JwtAuthGuard } from '../pkg/guard/jwt-auth.guard';
import { LocalAuthGuard } from '../pkg/guard/local-auth.guard';
import { SessionDto, SignInDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('')
@ApiTags('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: SignInDto })
  @ApiOkResponse({ type: SessionDto })
  async signIn(@User() user: UserEntity) {
    return this.authService.signIn(user);
  }

  @Get('/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async profile(@User() user: UserEntity) {
    return user;
  }

  @Get('/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async token(@Req() req: Request, @User() user: UserEntity) {
    const { authorization } = req.headers;
    const refreshToken = authorization.split(' ')[1];
    return this.authService.refreshAccessToken(user, refreshToken);
  }

  @Delete('/log-out')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async logOut(@Req() req: Request) {
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
    return this.authService.removeSession(accessToken);
  }
}
