import { Module } from '@nestjs/common';
import { ChatMessagesService } from './chat-messages.service';
import { ChatMessagesController } from './chat-messages.controller';
import { ChatGateway } from './ChatGateway';

@Module({
  controllers: [ChatMessagesController],
  providers: [ChatMessagesService,ChatGateway],
})
export class ChatMessagesModule {}
