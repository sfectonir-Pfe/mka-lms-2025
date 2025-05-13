import { Module } from '@nestjs/common';
import { ProgramModuleService } from './program-module.service';
import { ProgramModuleController } from './program-module.controller';

@Module({
  controllers: [ProgramModuleController],
  providers: [ProgramModuleService],
})
export class ProgramModuleModule {}
