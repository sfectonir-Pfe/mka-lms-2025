import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContenusService } from './contenus.service';
import { CreateContenuDto } from './dto/create-contenu.dto';
import { UpdateContenuDto } from './dto/update-contenu.dto';
import { ParseIntPipe } from '@nestjs/common';


@Controller('contenus')
export class ContenusController {
  constructor(private readonly contenusService: ContenusService) {}

  @Post()
  create(@Body() dto: CreateContenuDto) {
    return this.contenusService.create(dto);
  }

  @Get()
  findAll() {
    return this.contenusService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.contenusService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContenuDto) {
    return this.contenusService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.contenusService.remove(id);
  }
}