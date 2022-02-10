import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { GlobalModule } from './global.module';
import { configService } from './pkg/config/config.service';
import { UserSessionModule } from './user-session/user-session.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-http-print',
          options: {
            destination: 1,
            all: false,
            translateTime: true,
          },
        },
      },
    }),
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
