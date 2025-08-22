import { Controller, Post, Body, Get } from '@nestjs/common';
import { Etablissement2Service } from './etablissement2.service';

@Controller('etablissement2')
export class Etablissement2Controller {
  constructor(private readonly service: Etablissement2Service) {}

  @Post()
  async create(@Body('name') name: string) {
    return this.service.create(name);
  }

  @Get()
  async findAll() {
    return this.service.findAll();
  }
}
