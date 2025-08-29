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
import { Roles } from '../auth/roles.decorator';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @Roles('createurdeformation', 'admin')
  @Post()
  create(@Body() dto: CreateProgramDto) {
    return this.programsService.create(dto);
  }

  @Roles('createurdeformation', 'admin', 'etudiant','formateur')
  @Get()
  findAll() {
    return this.programsService.findAll();
  }

  @Roles('createurdeformation', 'admin')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(+id);
  }

  @Roles('createurdeformation', 'admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.programsService.remove(+id);
  }
  
@Roles('createurdeformation', 'admin')
@Patch(':id/rebuild')
rebuildProgram(@Param('id') id: string, @Body() body: any) {
  return this.programsService.rebuildProgram(+id, body);
}
@Roles('createurdeformation', 'admin')
@Patch(':id')
update(@Param('id') id: string, @Body() body: any) {
  return this.programsService.update(+id, body);
}
@Roles('createurdeformation', 'admin')
@Patch(':id/publish')
async publishProgram(@Param('id', ParseIntPipe) id: number) {
  return this.programsService.publishProgram(id);
}




}