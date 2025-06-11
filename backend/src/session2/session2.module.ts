import { Module } from '@nestjs/common';
import { Session2Service } from './session2.service';
import { Session2Controller } from './session2.controller';

@Module({
  controllers: [Session2Controller],
  providers: [Session2Service],
})
export class Session2Module {}
