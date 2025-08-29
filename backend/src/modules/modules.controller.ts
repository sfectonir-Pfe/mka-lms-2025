import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { ApiTags } from '@nestjs/swagger';
import { Patch } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Roles('CreateurDeFormation', 'Admin')
  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Roles('CreateurDeFormation', 'Admin','etudiant')
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }
  @Roles('CreateurDeFormation', 'Admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesService.remove(+id);
  }
  

}