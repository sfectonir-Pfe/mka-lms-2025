import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from 'nestjs-prisma'; 
import { Patch } from '@nestjs/common';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Post()
  create(@Body() dto: CreateProgramDto) {
    return this.programsService.create(dto);
  }

  @Get()
  findAll() {
    return this.programsService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programsService.remove(+id);
  }
  
@Patch(':id/rebuild')
rebuildProgram(@Param('id') id: string, @Body() body: any) {
  return this.programsService.rebuildProgram(+id, body);
}
@Patch(':id')
update(@Param('id') id: string, @Body() body: any) {
  return this.programsService.update(+id, body);
}
@Patch(':id/publish')
async publishProgram(@Param('id', ParseIntPipe) id: number) {
  return this.programsService.publishProgram(id);
}




}