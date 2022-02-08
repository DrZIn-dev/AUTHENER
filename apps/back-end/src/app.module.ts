import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';
import { configService } from './pkg/config/config.service';
import { UserModule } from './user/user.module';
import { UserSessionModule } from './user-session/user-session.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    GlobalModule,
    UserModule,
    AdminModule,
    UserSessionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
