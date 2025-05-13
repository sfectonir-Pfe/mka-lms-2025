import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProgramModuleService } from './program-module.service';
import { CreateProgramModuleDto } from './dto/create-program-module.dto';
import { UpdateProgramModuleDto } from './dto/update-program-module.dto';
import { ParseIntPipe } from '@nestjs/common';

@Controller('program-module')
export class ProgramModuleController {
  constructor(private readonly service: ProgramModuleService) {}

  @Post()
  assign(@Body() dto: CreateProgramModuleDto) {
    return this.service.assign(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}