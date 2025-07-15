// src/chat-messages/chat-messages.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

type ChatType = 'text' | 'image' | 'video' | 'audio' | 'file';

@Injectable()
export class ChatMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    seanceId: number;
    senderId?: number;
    type: ChatType;
    content: string;
  }) {
    return this.prisma.chatMessage.create({
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
  }

  async findBySeance(seanceId: number) {
    return this.prisma.chatMessage.findMany({
      where: { seanceId },
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
    const msg = await this.prisma.chatMessage.findUnique({ where: { id } });
    if (!msg) throw new Error('Message not found');
    if (msg.senderId !== userId) throw new Error('Not allowed');
    return this.prisma.chatMessage.delete({ where: { id } });
  }

  async deleteAllBySeance(seanceId: number) {
    return this.prisma.chatMessage.deleteMany({ where: { seanceId } });
  }
}
