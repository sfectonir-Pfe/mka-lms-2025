import { Module } from '@nestjs/common';
import { buildProgramService } from './buildProgram.service';
import { buildProgramController } from './buildProgram.controller';

@Module({
  controllers: [buildProgramController],
  providers: [buildProgramService],
})
export class buildProgramModule {}
