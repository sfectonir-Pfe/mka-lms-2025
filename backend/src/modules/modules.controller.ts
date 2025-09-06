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
import { Patch } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';
import { ApiBody, ApiProperty, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('JWT-auth')
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Roles('CreateurDeFormation', 'Admin')
  @Post()
  create(@Body() dto: CreateModuleDto) {
    return this.modulesService.create(dto);
  }

  @Roles('CreateurDeFormation', 'Admin','etudiant','formateur','Etablissement')
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