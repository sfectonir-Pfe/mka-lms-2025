import { Module } from '@nestjs/common';
import { GeneralChatMessagesService } from './general-chat-message.service'; // PLURAL!
import { GeneralChatMessagesController } from './general-chat-message.controller'; // PLURAL!
import { GeneralChatMessageGateway } from './generalchatmessagegateway';
import { NotificationModule } from '../notification/notification.module'; // <-- Import


@Module({
  imports: [NotificationModule], 
  controllers: [GeneralChatMessagesController],  // PLURAL!
  providers: [GeneralChatMessagesService, GeneralChatMessageGateway, ], // PLURAL!
})
export class GeneralChatMessageModule {}
