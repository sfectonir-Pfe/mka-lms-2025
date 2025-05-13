import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModuleCourseService } from './module-course.service';
import { CreateModuleCourseDto } from './dto/create-module-course.dto';
import { UpdateModuleCourseDto } from './dto/update-module-course.dto';
import { ParseIntPipe } from '@nestjs/common';
@Controller('module-course')
export class ModuleCourseController {
  constructor(private readonly service: ModuleCourseService) {}

  @Post()
  assign(@Body() dto: CreateModuleCourseDto) {
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