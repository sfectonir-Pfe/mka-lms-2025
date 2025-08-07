import { Module } from '@nestjs/common';
import { ContenusService } from './contenu.service';
import { ContenusController } from './contenu.controller';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],  // <-- Add this!
  controllers: [ContenusController],
  providers: [ContenusService],
})
export class ContenuModule {}
