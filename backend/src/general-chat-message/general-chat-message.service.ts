import { Injectable } from '@nestjs/common';
import { CreateGeneralChatMessageDto } from './dto/create-general-chat-message.dto';
import { UpdateGeneralChatMessageDto } from './dto/update-general-chat-message.dto';


import { PrismaService } from 'nestjs-prisma';

type ChatType = 'text' | 'image' | 'video' | 'audio' | 'file';

import { NotificationService } from '../notification/notification.service'; // Adjust the import as needed


 @Injectable()
export class GeneralChatMessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(data: {
    senderId?: number;
    type: ChatType;
    content: string;
  }) {
    const message = await this.prisma.generalChatMessage.create({
      data,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            role: true,
          },
        },
      },
    });

    // Fetch all users except sender
    const allUsers = await this.prisma.user.findMany({
      where: { id: { not: data.senderId } },
      select: { id: true },
    });

    // Send notification to each user
    for (const user of allUsers) {
      await this.notificationService.createMessageNotification(
        user.id,
        message.sender?.name || 'Quelqu\'un',
        data.type === 'text' ? data.content : `[${data.type}]`
      );
    }

    return message;
  }
    
  

  async findAll() {
    return this.prisma.generalChatMessage.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profilePic: true,
            role: true,
          },
        },
      },
    });
  }

  async deleteMessage(id: number, userId: number) {
    const msg = await this.prisma.generalChatMessage.findUnique({ where: { id } });
    if (!msg) throw new Error('Message not found');
    if (msg.senderId !== userId) throw new Error('Not allowed');
    return this.prisma.generalChatMessage.delete({ where: { id } });
  }

  async deleteAll() {
    return this.prisma.generalChatMessage.deleteMany({});
  }
}
