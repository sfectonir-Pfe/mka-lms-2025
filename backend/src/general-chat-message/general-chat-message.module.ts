import { Module } from '@nestjs/common';
import { GeneralChatMessagesService } from './general-chat-message.service'; // PLURAL!
import { GeneralChatMessagesController } from './general-chat-message.controller'; // PLURAL!
import { GeneralChatMessageGateway } from './generalchatmessagegateway';


@Module({
  controllers: [GeneralChatMessagesController],  // PLURAL!
  providers: [GeneralChatMessagesService, GeneralChatMessageGateway, ], // PLURAL!
})
export class GeneralChatMessageModule {}
