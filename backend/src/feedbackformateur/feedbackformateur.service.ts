import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFeedbackFormateurDto } from './dto/create-feedbackformateur.dto';

@Injectable()
export class FeedbackFormateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFeedbackFormateurDto) {
    // Récupérer le nom de l’étudiant
    const etudiant = await this.prisma.user.findUnique({
      where: { id: data.etudiantId },
      select: { name: true }
    });

    // Déduire le label de l’emoji (à adapter selon ta logique)
    const emojiLabels: Record<string, string> = {
      '😊': 'Satisfait',
      '👍': 'Excellent',
      '💡': 'Idées claires',
      '🚀': 'Progrès rapide',
      '🧠': 'Bonne compréhension',
      '⚠️': 'Attention nécessaire'
    };

    return this.prisma.feedbackFormateur.create({
      data: {
        studentId: data.etudiantId,
        studentName: etudiant?.name || '',
        emoji: data.emoji,
        emojiLabel: emojiLabels[data.emoji] || '',
        commentaire: data.commentaire || '',
        userId: data.formateurId,
      },
    });
  }

  async findAll() {
    return this.prisma.feedbackFormateur.findMany();
  }

  async findOne(id: number) {
    return this.prisma.feedbackFormateur.findUnique({ where: { id } });
  }

  async findAllByFormateur(userId: number) {
    const feedbacks = await this.prisma.feedbackFormateur.findMany({
      where: { userId }
    });
    return await Promise.all(feedbacks.map(async f => {
      const student = await this.prisma.user.findUnique({ where: { id: f.studentId }, select: { email: true } });
      return {
        ...f,
        studentEmail: student?.email || ''
      };
    }));
  }

  async findAllBySeance(seanceId: number) {
    const feedbacks = await this.prisma.feedbackFormateur.findMany({
      where: { seanceId }
    });
    return await Promise.all(feedbacks.map(async f => {
      const student = await this.prisma.user.findUnique({ where: { id: f.studentId }, select: { email: true } });
      return {
        ...f,
        studentEmail: student?.email || ''
      };
    }));
  }

  async remove(id: number) {
    return this.prisma.feedbackFormateur.delete({ where: { id } });
  }
}
