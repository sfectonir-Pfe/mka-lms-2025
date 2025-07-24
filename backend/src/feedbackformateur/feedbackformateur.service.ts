import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFeedbackFormateurDto } from './dto/create-feedbackformateur.dto';

@Injectable()
export class FeedbackFormateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFeedbackFormateurDto) {
    console.log('Payload reçu pour création feedback:', data);
    const etudiant = await this.prisma.user.findUnique({
      where: { id: data.etudiantId },
      select: { name: true },
    });

    const emojiLabels: Record<string, string> = {
      '😊': 'Satisfait',
      '👍': 'Excellent',
      '💡': 'Idées claires',
      '🚀': 'Progrès rapide',
      '🧠': 'Bonne compréhension',
      '⚠️': 'Attention nécessaire',
    };

    const created = await this.prisma.feedbackFormateur.create({
      data: {
        studentId: data.etudiantId,
        studentName: etudiant?.name || '',
        emoji: data.emoji,
        emojiLabel: emojiLabels[data.emoji] || '',
        commentaire: data.commentaire || '',
        formateurId: data.formateurId, // <-- bien utiliser formateurId
        seanceId: data.seanceId,       // <-- bien utiliser seanceId
      },
    });
    console.log('FeedbackFormateur créé:', created);
    return created;
  }

  async findAll() {
    return this.prisma.feedbackFormateur.findMany();
  }

  async findOne(id: number) {
    return this.prisma.feedbackFormateur.findUnique({ where: { id } });
  }

  async findAllByFormateur(userId: number) {
    const feedbacks = await this.prisma.feedbackFormateur.findMany({
      where: { userId },
    });

    return await Promise.all(
      feedbacks.map(async (f) => {
        const student = await this.prisma.user.findUnique({
          where: { id: f.studentId },
          select: { email: true },
        });
        return {
          ...f,
          studentEmail: student?.email || '',
        };
      }),
    );
  }

  async findAllBySeance(seanceId: number) {
    const feedbacks = await this.prisma.feedbackFormateur.findMany({
      where: { seanceId }
    });
    return await Promise.all(feedbacks.map(async f => {
      const student = await this.prisma.user.findUnique({ where: { id: f.studentId }, select: { email: true } });
      return {
        id: f.id,
        studentName: f.studentName,
        studentEmail: student?.email || '',
        emoji: f.emoji,
        emojiLabel: f.emojiLabel,
        commentaire: f.commentaire,
        seanceId: f.seanceId,
        studentId: f.studentId,
        createdAt: f.createdAt,
      };
    }));
  }

  async findAllByFormateurAndSeance(formateurId: number, seanceId: number) {
    const feedbacks = await this.prisma.feedbackFormateur.findMany({
      where: {
        userId: formateurId,
        seanceId,
      },
    });

    return await Promise.all(
      feedbacks.map(async (f) => {
        const student = await this.prisma.user.findUnique({
          where: { id: f.studentId },
          select: { email: true },
        });
        return {
          ...f,
          studentEmail: student?.email || '',
        };
      }),
    );
  }

  async remove(id: number) {
    return this.prisma.feedbackFormateur.delete({ where: { id } });
  }
}
