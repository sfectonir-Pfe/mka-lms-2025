import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

type ChatType = 'text' | 'image' | 'video' | 'audio' | 'file';

@Injectable()
export class ProgramChatService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    programId: number;
    senderId?: number;
    type: ChatType;
    content: string;
  }) {
    if (!data.content?.trim()) throw new BadRequestException('Empty content');
    return this.prisma.programChatMessage.create({
      data: { ...data, content: data.content.trim() },
      include: {
        sender: {
          select: { id: true, name: true, profilePic: true, role: true },
        },
      },
    });
  }

  // simple pagination by limit (ascending chronological order)
  async findByProgram(programId: number, limit = 50) {
    return this.prisma.programChatMessage.findMany({
      where: { programId },
      orderBy: { createdAt: 'asc' },
      take: limit,
      include: {
        sender: {
          select: { id: true, name: true, profilePic: true, role: true },
        },
      },
    });
  }

  async deleteMessage(id: number, userId: number) {
    const msg = await this.prisma.programChatMessage.findUnique({ where: { id } });
    if (!msg) throw new NotFoundException('Message not found');
    // keep your original “only sender can delete” logic
    if (msg.senderId !== userId) throw new BadRequestException('Not allowed');
    return this.prisma.programChatMessage.delete({ where: { id } });
  }

  async deleteAllByProgram(programId: number) {
    return this.prisma.programChatMessage.deleteMany({ where: { programId } });
  }

  async getUserPrograms(userId: number) {
    // Get all programs where the user has sessions
    const userSessions = await this.prisma.userSession2.findMany({
      where: { userId },
      include: {
        session2: {
          include: {
            program: {
              select: { id: true, name: true }
            }
          }
        }
      }
    });

    // Extract unique programs
    const programsMap = new Map();
    userSessions.forEach(session => {
      if (session.session2?.program) {
        const program = session.session2.program;
        programsMap.set(program.id, program);
      }
    });

    return Array.from(programsMap.values());
  }
}
