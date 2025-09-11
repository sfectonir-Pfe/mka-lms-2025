import { Controller, Get, Param, Patch, Delete, Post, Body, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getNotifications(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Get(':userId/unread-count')
  async getUnreadCount(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.getUnreadCountForUser(userId);
  }

  @Patch(':notificationId/read')
  async markAsRead(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }

  @Patch(':userId/mark-all-read')
  async markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    return this.notificationService.markAllNotificationsAsRead(userId);
  }

  @Delete(':notificationId')
  async deleteNotification(@Param('notificationId', ParseIntPipe) notificationId: number) {
    return this.notificationService.deleteNotification(notificationId);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createNotification(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }
}
