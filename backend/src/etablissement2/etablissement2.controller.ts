import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Etablissement2Service } from './etablissement2.service';
import { Roles } from '../auth/roles.decorator';

@Controller('etablissement2')
export class Etablissement2Controller {
  constructor(private readonly service: Etablissement2Service) {}

  @Roles('admin', 'createurdeformation','etablissement')
  @Post()
  async create(@Body('name') name: string) {
    return this.service.create(name);
  }

  @Roles('admin', 'createurdeformation', 'Etablissement', 'etudiant', 'formateur')
  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Roles('admin', 'createurdeformation', 'etablissement')
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return this.service.findByUserId(parseInt(userId));
  }
}
