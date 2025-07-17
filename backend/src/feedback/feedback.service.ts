import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';
import { CreateGeneralFeedbackDto } from './dto/create-general-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({ data: dto });
  }

  async createGeneralFeedback(dto: CreateGeneralFeedbackDto) {
    const feedbackData = {
      type: dto.feedbackType,
      category: dto.category,
      message: `${dto.title}\n\n${dto.description}` +
        (dto.stepsToReproduce ? `\n\nÉtapes pour reproduire:\n${dto.stepsToReproduce}` : '') +
        (dto.expectedBehavior ? `\n\nComportement attendu:\n${dto.expectedBehavior}` : '') +
        (dto.actualBehavior ? `\n\nComportement actuel:\n${dto.actualBehavior}` : '') +
        (dto.browser ? `\n\nNavigateur: ${dto.browser}` : '') +
        (dto.device ? `\n\nAppareil: ${dto.device}` : '') +
        (dto.contactInfo ? `\n\nContact: ${dto.contactInfo}` : '') +
        (dto.allowContact ? `\n\nAutorise le contact: Oui` : ''),
      rating: 0,
      userId: dto.userId,
    };
    return this.prisma.feedback.create({ data: feedbackData });
  }

  async findAll(filters: any = {}) {
    const { search, ...rest } = filters;
    const where: any = { ...rest };
    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.feedback.findMany({
      where,
      include: { responses: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    if (!id || isNaN(Number(id))) {
      throw new BadRequestException('Feedback ID is required and must be a number');
    }
    const feedback = await this.prisma.feedback.findUnique({
      where: { id: Number(id) },
      include: { responses: true },
    });
    if (!feedback) throw new NotFoundException(`Feedback with ID ${id} not found`);
    return feedback;
  }

  async update(id: number, dto: UpdateFeedbackDto) {
    await this.findOne(id);
    return this.prisma.feedback.update({
      where: { id },
      data: { ...dto, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.feedback.delete({ where: { id } });
  }

  async like(id: number) {
    const feedback = await this.findOne(id);
    return this.prisma.feedback.update({
      where: { id },
      data: { likes: feedback.likes + 1 },
    });
  }

  async dislike(id: number) {
    const feedback = await this.findOne(id);
    return this.prisma.feedback.update({
      where: { id },
      data: { dislikes: feedback.dislikes + 1 },
    });
  }

  async createResponse(id: number, dto: CreateFeedbackResponseDto) {
    await this.findOne(id);
    return this.prisma.feedbackResponse.create({
      data: { response: dto.response, feedbackId: id },
    });
  }

  async createSeanceFeedback(dto: any) {
    return this.prisma.seanceFeedback.create({ data: dto });
  }

  async getSeanceFeedbacks(seanceId: number) {
    return this.prisma.seanceFeedback.findMany({
      where: { seanceId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createSessionFeedback(dto: any) {
    return this.prisma.sessionFeedback.create({ data: dto });
  }

  async getSessionFeedbacks(sessionId: number) {
    return this.prisma.sessionFeedback.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'desc' },
      include: { user: true }, // Ajout pour inclure les infos utilisateur
    });
  }

  async getStats() {
    const feedbacks = await this.prisma.feedback.findMany({ include: { responses: true } });
    const totalFeedbacks = feedbacks.length;
    const totalRating = feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
    const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
    const categories = {};
    feedbacks.forEach(fb => {
      if (fb.category) {
        categories[fb.category] = (categories[fb.category] || 0) + 1;
      }
    });
    const categoryBreakdown = Object.entries(categories).map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count as number) / totalFeedbacks * 100),
    }));
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentFeedbackCount = feedbacks.filter(fb => new Date(fb.createdAt) >= oneWeekAgo).length;
    const pendingResponses = feedbacks.filter(fb => !fb.responses || fb.responses.length === 0).length;
    return {
      totalFeedbacks,
      averageRating,
      categoryBreakdown,
      recentFeedbackCount,
      pendingResponses,
    };
  }

  async getAnalytics(timeRange = '6months') {
    const feedbacks = await this.prisma.feedback.findMany({ include: { responses: true } });
    const filtered = this.filterByTimeRange(feedbacks, timeRange);
    const ratingData = [5, 4, 3, 2, 1].map(rating => ({
      name: `${rating} Stars`,
      count: filtered.filter(fb => Math.round(fb.rating) === rating).length,
    }));
    const categories = {};
    filtered.forEach(fb => {
      if (fb.category) {
        categories[fb.category] = (categories[fb.category] || 0) + 1;
      }
    });
    const categoryData = Object.entries(categories).map(([name, value]) => ({ name, value }));
    const timelineData = this.generateTimelineData(filtered, timeRange);
    return { ratingData, categoryData, timelineData };
  }

  private filterByTimeRange(feedbacks, range: string) {
    const now = new Date();
    let cutoff: Date;
    switch (range) {
      case '30days':
        cutoff = new Date(now.setDate(now.getDate() - 30));
        break;
      case '3months':
        cutoff = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        cutoff = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1year':
        cutoff = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        return feedbacks;
    }
    return feedbacks.filter(fb => new Date(fb.createdAt) >= cutoff);
  }

  private generateTimelineData(feedbacks, range: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (range === '30days') {
      const daily: Record<string, number> = {};
      const now = new Date();

      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const label = `${date.getDate()} ${months[date.getMonth()]}`;
        daily[label] = 0;
      }

      feedbacks.forEach(fb => {
        const date = new Date(fb.createdAt);
        const label = `${date.getDate()} ${months[date.getMonth()]}`;
        if (daily[label] !== undefined) daily[label]++;
      });

      return Object.entries(daily).reverse().map(([day, count]) => ({ day, count }));
    }

    const monthly: Record<string, number> = {};
    months.forEach(month => { monthly[month] = 0; });

    feedbacks.forEach(fb => {
      const month = months[new Date(fb.createdAt).getMonth()];
      monthly[month]++;
    });

    return Object.entries(monthly).map(([month, count]) => ({ month, count }));
  }
}
