import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { NotificationGateway } from './notification-gateway';

@Injectable()
export class NotificationService {
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
  async getNotificationsForUser(userId: number | string) {
    return await this.prisma.notification.findMany({
      where: { userId: Number(userId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Mark a notification as read
  // Mark a notification as read
async markNotificationAsRead(notificationId: number | string) {
  // Convert notificationId to an integer
  const idAsInt = Number(notificationId);
  
  return await this.prisma.notification.update({
    where: {
      id: idAsInt, // Use the integer ID here
    },
    data: {
      read: true,
    },
  });
}

  // Get unread count for a user
  async getUnreadCountForUser(userId: number | string) {
    const count = await this.prisma.notification.count({
      where: {
        userId: Number(userId),
        read: false,
      },
    });
    return { count };
  }

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(userId: number | string) {
    return await this.prisma.notification.updateMany({
      where: {
        userId: Number(userId),
        read: false,
      },
      data: { read: true },
    });
  }

  // Delete a notification
  // Delete a notification
async deleteNotification(notificationId: number | string) {
  console.log('Deleting notification with ID:', notificationId);
  
  // Convert notificationId to an integer
  const idAsInt = Number(notificationId);
  
  // Delete the notification from the database
  const notification = await this.prisma.notification.delete({
    where: { id: idAsInt },
  });

  return notification; // Optionally return the deleted notification
}

  // Create a new notification (for admin/test use)
  async createNotification(createNotificationDto: any) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: createNotificationDto.userId,
        type: createNotificationDto.type || 'info',
        message: createNotificationDto.message,
        link: createNotificationDto.link || null,
      },
    });
    this.notificationGateway.sendRealTimeNotification(notification.userId, notification);
    return notification;
  }
  
}
