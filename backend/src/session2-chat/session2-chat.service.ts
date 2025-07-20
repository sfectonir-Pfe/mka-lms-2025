import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

type Session2MessageInput = {
  session2Id: number;
  senderId?: number;
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
};

@Injectable()
export class Session2ChatService {
  private readonly logger = new Logger(Session2ChatService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create and broadcast a session chat message
   */
  async create(data: Session2MessageInput) {
    this.logger.log(
      `Creating message | session2Id: ${data.session2Id}, senderId: ${data.senderId}, type: ${data.type}`,
    );

    // 1. Validate session exists
    const session = await this.prisma.session2.findUnique({
      where: { id: data.session2Id },
    });
    if (!session) {
      this.logger.warn(`Session2 not found: ${data.session2Id}`);
      throw new Error(`Session2 with id ${data.session2Id} does not exist!`);
    }

    // 2. [Optional] Check sender is participant of session
    // if (data.senderId) {
    //   const isParticipant = await this.prisma.userSession2.findFirst({
    //     where: { userId: data.senderId, session2Id: data.session2Id }
    //   });
    //   if (!isParticipant) {
    //     this.logger.warn(`User ${data.senderId} tried to send to session2 ${data.session2Id} without being a participant`);
    //     throw new Error('Not a participant of this session');
    //   }
    // }

    // 3. Create message
    const newMsg = await this.prisma.session2ChatMessage.create({
      data: {
        session2Id: data.session2Id,
        senderId: data.senderId,
        type: data.type,
        content: data.content,
      },
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

    this.logger.log(
      `Message created | id: ${newMsg.id}, session2Id: ${data.session2Id}, senderId: ${data.senderId}`,
    );
    return newMsg;
  }

  /**
   * Get all chat messages for a session2
   */
  async findBySession2(session2Id: number) {
    this.logger.log(`Fetching messages for session2: ${session2Id}`);
    return this.prisma.session2ChatMessage.findMany({
      where: { session2Id },
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

  /**
   * Delete a message (only if owner)
   */
  async deleteIfOwner(id: number, userId: number) {
    this.logger.log(`User ${userId} requests delete message ${id}`);
    const msg = await this.prisma.session2ChatMessage.findUnique({ where: { id } });
    if (!msg) {
      this.logger.warn(`Delete failed: Message ${id} not found`);
      throw new Error('Message not found');
    }
    if (msg.senderId !== userId) {
      this.logger.warn(`Delete forbidden: User ${userId} not owner of message ${id}`);
      throw new Error('Not allowed');
    }
    await this.prisma.session2ChatMessage.delete({ where: { id } });
    this.logger.log(`Message ${id} deleted by user ${userId}`);
    return { success: true };
  }

  /**
   * Delete all messages in a session2 (admin/formateur only)
   */
  async deleteAllBySession2(session2Id: number) {
    this.logger.warn(`Deleting ALL messages for session2: ${session2Id}`);
    await this.prisma.session2ChatMessage.deleteMany({ where: { session2Id } });
    return { success: true };
  }
}
