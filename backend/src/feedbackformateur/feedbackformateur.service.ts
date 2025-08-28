import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateFeedbackFormateurDto } from './dto/create-feedbackformateur.dto';
import { MailService } from '../mail/mail.service'; // Added import for MailService

@Injectable()
export class FeedbackFormateurService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService, // Added MailService to constructor
  ) {}

  async create(data: CreateFeedbackFormateurDto) {
    console.log('Payload reçu pour création feedback:', data);
    const etudiant = await this.prisma.user.findUnique({
      where: { id: data.etudiantId },
      select: { name: true, email: true }, // Added email to select
    });

    const formateur = await this.prisma.user.findUnique({
      where: { id: data.formateurId },
      select: { name: true },
    });

    // Récupérer les informations de la séance (optionnel)
    let seanceName = '';
    if (data.seanceId) {
      try {
        const seance = await this.prisma.seanceFormateur.findUnique({
          where: { id: data.seanceId },
          select: { title: true },
        });
        seanceName = seance?.title || '';
      } catch (error) {
        console.log('Impossible de récupérer le nom de la séance:', error);
      }
    }

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
        formateurId: data.formateurId,
        seanceId: data.seanceId,
      },
    });
    console.log('FeedbackFormateur créé:', created);

    // Envoyer l'email de notification à l'étudiant
    if (etudiant?.email && formateur?.name) {
      try {
        await this.mailService.sendFeedbackEmail(
          etudiant.email,
          etudiant.name || 'Étudiant',
          formateur.name || 'Formateur',
          data.emoji,
          emojiLabels[data.emoji] || '',
          data.commentaire || '',
          seanceName
        );
        console.log(`Email de feedback envoyé avec succès à ${etudiant.email}`);
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email de feedback:', error);
        // Ne pas faire échouer la création du feedback si l'email échoue
      }
    }
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
      where: { formateurId: userId },
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
        formateurId: formateurId,
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
