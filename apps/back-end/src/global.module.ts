import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { configService } from './pkg/config/config.service';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: configService.getJwtSecret(),
    }),
  ],
  controllers: [],
  providers: [],
  exports: [JwtModule],
})
export class GlobalModule {}
