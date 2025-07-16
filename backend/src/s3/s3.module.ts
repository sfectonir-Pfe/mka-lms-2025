import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';

@Module({
  imports: [ConfigModule],
  controllers: [S3Controller],
  providers: [S3Service],
  exports: [S3Service], // Exporter le service pour l'utiliser dans d'autres modules
})
export class S3Module {}
