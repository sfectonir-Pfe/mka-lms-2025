import { Controller, Get, Post, Body, Patch, Param, Delete,   InternalServerErrorException,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.programsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProgramDto) {
    return this.programsService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.programsService.remove(+id);
    } catch (error) {
      console.error(" Delete failed:", error.message);
      throw new InternalServerErrorException("Program deletion failed. It may have linked modules.");
    }
  }}