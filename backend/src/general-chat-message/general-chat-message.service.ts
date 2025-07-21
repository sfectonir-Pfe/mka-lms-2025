import { Injectable } from '@nestjs/common';
import { CreateGeneralChatMessageDto } from './dto/create-general-chat-message.dto';
import { UpdateGeneralChatMessageDto } from './dto/update-general-chat-message.dto';


import { PrismaService } from 'nestjs-prisma';

type ChatType = 'text' | 'image' | 'video' | 'audio' | 'file';

@Injectable()
export class GeneralChatMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    senderId?: number;
    type: ChatType;
    content: string;
  }) {
    return this.prisma.generalChatMessage.create({
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
