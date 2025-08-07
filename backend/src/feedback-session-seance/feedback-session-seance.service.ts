import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FeedbackSessionSeanceService {
  constructor(private prisma: PrismaService) {}

  async createSeanceFeedback(data: any) {
    return this.prisma.seanceFeedback.create({ data });
  }

  async getSeanceFeedbacks(seanceId: number) {
    return this.prisma.seanceFeedback.findMany({
      where: { seanceId },
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }
}
