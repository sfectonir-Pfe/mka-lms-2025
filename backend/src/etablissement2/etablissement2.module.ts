import { Module } from '@nestjs/common';
import { Etablissement2Service } from './etablissement2.service';
import { Etablissement2Controller } from './etablissement2.controller';

@Module({
  controllers: [Etablissement2Controller],
  providers: [Etablissement2Service],
})
export class Etablissement2Module {}
