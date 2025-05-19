import { Module } from '@nestjs/common';
import { SessionsService } from './session.service';
import { SessionsController } from './session.controller';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
})
export class SessionModule {}
