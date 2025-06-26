import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { CreateFeedbackResponseDto } from './dto/create-feedback-response.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async create(createFeedbackDto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: createFeedbackDto,
    });
  }

  async findAll(filters: any = {}) {
    const { search, ...restFilters } = filters;
    
    const where: any = { ...restFilters };
    
    // Add search functionality
    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    return this.prisma.feedback.findMany({
      where,
      include: {
        responses: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const feedback = await this.prisma.feedback.findUnique({
      where: { id },
      include: {
        responses: true,
      },
    });

    if (!feedback) {
      throw new NotFoundException(`Feedback with ID ${id} not found`);
    }

    return feedback;
  }
  
  async update(id: number, updateFeedbackDto: UpdateFeedbackDto) {
    await this.findOne(id);
    
    return this.prisma.feedback.update({
      where: { id },
      data: {
        ...updateFeedbackDto,
        updatedAt: new Date(),
      },
    });
  }
  
  async remove(id: number) {
    await this.findOne(id);
    
    return this.prisma.feedback.delete({
      where: { id },
    });
  }

  async createResponse(id: number, dto: CreateFeedbackResponseDto) {
    await this.findOne(id);

    return this.prisma.feedbackResponse.create({
      data: {
        ...dto,
        feedbackId: id,
      },
    });
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

  async getStats() {
    const feedbacks = await this.prisma.feedback.findMany({
      include: {
        responses: true
      }
    });
    
    const totalFeedbacks = feedbacks.length;
    
    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
    const averageRating = totalFeedbacks > 0 ? totalRating / totalFeedbacks : 0;
    
    // Get category breakdown
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
    
    // Count recent feedback (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentFeedbackCount = feedbacks.filter(fb => 
      new Date(fb.createdAt) >= oneWeekAgo
    ).length;
    
    // Count pending responses (feedbacks without responses)
    const pendingResponses = feedbacks.filter(fb => 
      !fb.responses || fb.responses.length === 0
    ).length;
    
    return {
      totalFeedbacks,
      averageRating,
      categoryBreakdown,
      recentFeedbackCount,
      pendingResponses,
    };
  }

  async getAnalytics(timeRange = '6months') {
    const feedbacks = await this.prisma.feedback.findMany({
      include: {
        responses: true
      }
    });
    
    // Filter by time range
    const filteredFeedbacks = this.filterByTimeRange(feedbacks, timeRange);
    
    // Rating distribution
    const ratingData = [5, 4, 3, 2, 1].map(rating => ({
      name: `${rating} Stars`,
      count: filteredFeedbacks.filter(fb => 
        Math.round(fb.rating) === rating
      ).length,
    }));
    
    // Category distribution
    const categories = {};
    filteredFeedbacks.forEach(fb => {
      if (fb.category) {
        categories[fb.category] = (categories[fb.category] || 0) + 1;
      }
    });
    
    const categoryData = Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
    
    // Timeline data
    const timelineData = this.generateTimelineData(filteredFeedbacks, timeRange);
    
    return {
      ratingData,
      categoryData,
      timelineData,
    };
  }

  private filterByTimeRange(feedbacks, timeRange: string) {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (timeRange) {
      case '30days':
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case '3months':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case '6months':
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case '1year':
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      case 'all':
      default:
        return feedbacks;
    }
    
    return feedbacks.filter(fb => new Date(fb.createdAt) >= cutoffDate);
  }

  private generateTimelineData(feedbacks, timeRange: string) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (timeRange === '30days') {
      // Daily data for last 30 days
      const dailyData = {};
      const now = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = `${date.getDate()} ${months[date.getMonth()]}`;
        dailyData[dateStr] = 0;
      }
      
      feedbacks.forEach(fb => {
        const date = new Date(fb.createdAt);
        const dateStr = `${date.getDate()} ${months[date.getMonth()]}`;
        if (dailyData[dateStr] !== undefined) {
          dailyData[dateStr]++;
        }
      });
      
      return Object.entries(dailyData).reverse().map(([day, count]) => ({
        day,
        count,
      }));
    } else {
      // Monthly data
      const monthlyData = {};
      months.forEach(month => {
        monthlyData[month] = 0;
      });
      
      feedbacks.forEach(fb => {
        const month = months[new Date(fb.createdAt).getMonth()];
        monthlyData[month]++;
      });
      
      return Object.entries(monthlyData).map(([month, count]) => ({
        month,
        count,
      }));
    }
  }
}