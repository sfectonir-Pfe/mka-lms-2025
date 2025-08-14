// modules.module.ts
import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { NotificationModule } from '../notification/notification.module'; // Adjust path

@Module({
  imports: [NotificationModule], // <-- Import here!
  providers: [ModulesService, ],
  controllers: [ModulesController],
})
export class ModulesModule {}
