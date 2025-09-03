import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationGateway } from './notification-gateway';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  // Create a new message notification and send it (for chat)
  async createMessageNotification(userId: number, senderName: string, messageContent: string) {
    console.log('Creating notification in DB for', userId);
    const notification = await this.prisma.notification.create({
      data: {
        userId,
        type: 'message-new',
        message: `${senderName} has sent you a new message: ${messageContent}`,
      },
    });
    console.log('Calling gateway for real-time notification for', userId, notification.message);
    this.notificationGateway.sendRealTimeNotification(userId, notification);
    return notification;
  }

  // Get all notifications for a user
  async getNotificationsForUser(userId: number) {
    try {
      return await this.prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`Failed to get notifications for user ${userId}:`, error);
      throw error;
    }
  }

  // Mark a notification as read
  async markNotificationAsRead(notificationId: number) {
    try {
      // First check if notification exists
      const existingNotification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!existingNotification) {
        this.logger.warn(`Notification ${notificationId} not found for update`);
        return { message: `Notification with ID ${notificationId} already read or not found`, updated: false };
      }

      return await this.prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } catch (error) {
      this.logger.error(`Failed to mark notification ${notificationId} as read:`, error);
      throw error;
    }
  }

  // Get unread count for a user
  async getUnreadCountForUser(userId: number) {
    try {
      const count = await this.prisma.notification.count({
        where: {
          userId,
          read: false,
        },
      });
      return { count };
    } catch (error) {
      this.logger.error(`Failed to get unread count for user ${userId}:`, error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(userId: number) {
    try {
      return await this.prisma.notification.updateMany({
        where: {
          userId,
          read: false,
        },
        data: { read: true },
      });
    } catch (error) {
      this.logger.error(`Failed to mark all notifications as read for user ${userId}:`, error);
      throw error;
    }
  }

  // Delete a notification
  async deleteNotification(notificationId: number) {
    try {
      this.logger.log(`Deleting notification with ID: ${notificationId}`);
      
      // First check if notification exists
      const existingNotification = await this.prisma.notification.findUnique({
        where: { id: notificationId },
      });

      if (!existingNotification) {
        this.logger.warn(`Notification ${notificationId} not found for deletion`);
        return { message: `Notification with ID ${notificationId} already deleted or not found`, deleted: false };
      }

      const notification = await this.prisma.notification.delete({
        where: { id: notificationId },
      });
      return notification;
    } catch (error) {
      this.logger.error(`Failed to delete notification ${notificationId}:`, error);
      throw error;
    }
  }

  // Create a new notification
  async createNotification(createNotificationDto: CreateNotificationDto) {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          userId: createNotificationDto.userId,
          type: createNotificationDto.type,
          message: createNotificationDto.message,
          link: createNotificationDto.link || null,
        },
      });
      this.notificationGateway.sendRealTimeNotification(notification.userId, notification);
      return notification;
    } catch (error) {
      this.logger.error('Failed to create notification:', error);
      throw error;
    }
  }
  
}
