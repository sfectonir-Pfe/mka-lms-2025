import { Module } from '@nestjs/common';
import { RéclamationService } from './réclamation.service';
import { RéclamationController } from './réclamation.controller';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [RéclamationController],
  providers: [RéclamationService],
  exports: [RéclamationService],
})
export class RéclamationModule {}
