import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification-gateway';
import { NotificationController } from './notification.controller'; // <-- Import controller

@Module({
  providers: [NotificationService, NotificationGateway],
  controllers: [NotificationController],                // <-- REGISTER controller here!
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
