import { Controller, Get, Param, Patch, Delete, Post, Body } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get(':userId')
  async getNotifications(@Param('userId') userId: number) {
    return this.notificationService.getNotificationsForUser(userId);
  }

  @Get(':userId/unread-count')
  async getUnreadCount(@Param('userId') userId: number) {
    return this.notificationService.getUnreadCountForUser(userId);
  }

  @Patch(':notificationId/read')
  async markAsRead(@Param('notificationId') notificationId: number) {
    return this.notificationService.markNotificationAsRead(notificationId);
  }

  @Patch(':userId/mark-all-read')
  async markAllAsRead(@Param('userId') userId: number) {
    return this.notificationService.markAllNotificationsAsRead(userId);
  }

  @Delete(':notificationId')
  async deleteNotification(@Param('notificationId') notificationId: number) {
    return this.notificationService.deleteNotification(notificationId);
  }

  @Post()
  async createNotification(@Body() createNotificationDto: any) {
    return this.notificationService.createNotification(createNotificationDto);
  }
}
