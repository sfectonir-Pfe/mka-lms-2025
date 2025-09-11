import { Module } from '@nestjs/common';
import { Session2ChatService } from './session2-chat.service';
import { Session2ChatController } from './session2-chat.controller';
import { Session2ChatGateway } from './Session2ChatGateway';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [Session2ChatController],
  providers: [Session2ChatService, Session2ChatGateway],
})
export class Session2ChatModule {}
