import { Module } from '@nestjs/common';
import { ProgramChatService } from './program-chat.service';
import { ProgramChatController } from './program-chat.controller';
import { ProgramChatGateway } from './program-chat.gateway';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [ProgramChatController],
  providers: [ProgramChatService, ProgramChatGateway],
  exports: [ProgramChatService, ProgramChatGateway], // <-- needed if used elsewhere
})
export class ProgramChatModule {}
