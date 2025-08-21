import { Module } from '@nestjs/common';
import { ProgramChatService } from './program-chat.service';
import { ProgramChatController } from './program-chat.controller';
import { ProgramChatGateway } from './program-chat.gateway';

@Module({
  controllers: [ProgramChatController],
  providers: [ProgramChatService, ProgramChatGateway],
  exports: [ProgramChatService, ProgramChatGateway], // <-- needed if used elsewhere
})
export class ProgramChatModule {}
