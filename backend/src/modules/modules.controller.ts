import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @Get('by-program/:programId')
  findByProgram(@Param('programId') programId: string) {
    const id = Number(programId);
    if (isNaN(id)) {
      throw new BadRequestException("Invalid programId");
    }
    return this.modulesService.findByProgram(id);
  }

  


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.modulesService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(+id);
  }
}