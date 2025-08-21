// seance-feedback.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class SeanceFeedbackService {
  constructor(private prisma: PrismaService) {}

  async createSeanceFeedback(dto: any) {
    const { seanceId, userId } = dto;

    if (!userId) throw new BadRequestException('userId requis');
    if (!seanceId) throw new BadRequestException('seanceId requis');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException(`Utilisateur ${userId} introuvable`);

    const feedbackMessage = dto.feedback || this.generateFeedbackMessage(dto);
    const existing = await this.prisma.seanceFeedback.findFirst({ where: { seanceId, userId }, orderBy: { createdAt: 'desc' } });

    if (existing) {
      await this.prisma.seanceFeedback.update({
        where: { id: existing.id },
        data: { ...dto },
      });

      await this.prisma.feedbackList.updateMany({
        where: { seanceId, userId },
        data: {
          feedback: feedbackMessage,
          nom: user.name ?? '',
          email: user.email,
          sessionComments: dto.sessionComments,
          trainerComments: dto.trainerComments,
          teamComments: dto.teamComments,
          suggestions: dto.suggestions,
        },
      });
    } else {
      await this.prisma.$transaction([
        this.prisma.seanceFeedback.create({ data: { ...dto, userId } }),
        this.prisma.feedbackList.create({
          data: {
            seanceId,
            userId,
            feedback: feedbackMessage,
            nom: user.name ?? '',
            email: user.email,
            sessionComments: dto.sessionComments,
            trainerComments: dto.trainerComments,
            teamComments: dto.teamComments,
            suggestions: dto.suggestions,
          },
        }),
      ]);
    }

    await this.cleanupOldFeedbacks(seanceId);
    return { message: 'Feedback enregistré avec succès' };
  }

  private generateFeedbackMessage(dto: any): string {
    const parts: string[] = [];
    const ratings = [
      { name: 'Session', value: dto.sessionRating },
      { name: 'Qualité du contenu', value: dto.contentQuality },
      { name: 'Organisation', value: dto.sessionOrganization },
      { name: 'Objectifs atteints', value: dto.objectivesAchieved },
      { name: 'Formateur', value: dto.trainerRating },
      { name: 'Clarté du formateur', value: dto.trainerClarity },
      { name: 'Disponibilité', value: dto.trainerAvailability },
      { name: 'Pédagogie', value: dto.trainerPedagogy },
      { name: 'Interaction', value: dto.trainerInteraction },
      { name: 'Équipe', value: dto.teamRating },
      { name: 'Collaboration', value: dto.teamCollaboration },
      { name: 'Participation', value: dto.teamParticipation },
      { name: 'Communication', value: dto.teamCommunication },
    ];
    const valid = ratings.filter(r => r.value !== null && r.value !== undefined);
    if (valid.length > 0) {
      const avg = valid.reduce((sum, r) => sum + r.value, 0) / valid.length;
      parts.push(`Note moyenne: ${avg.toFixed(1)}/5`);
    }
    if (dto.sessionComments) parts.push(`Commentaires sur la session: ${dto.sessionComments}`);
    if (dto.trainerComments) parts.push(`Commentaires sur le formateur: ${dto.trainerComments}`);
    if (dto.teamComments) parts.push(`Commentaires sur l'équipe: ${dto.teamComments}`);
    if (dto.suggestions) parts.push(`Suggestions: ${dto.suggestions}`);
    if (dto.improvementAreas) parts.push(`Zones d'amélioration: ${dto.improvementAreas}`);
    if (dto.wouldRecommend) parts.push(`Recommanderait: ${dto.wouldRecommend}`);

    return parts.join('\n\n') || 'Feedback de séance soumis';
  }

  async getFeedbackList(seanceId: number) {
    const feedbacks = await this.prisma.feedbackList.findMany({
      where: { seanceId },
      orderBy: { createdAt: 'desc' },
    });

    const unique = new Map<string, typeof feedbacks[0]>();
    feedbacks.forEach(fb => {
      if (fb.email && !unique.has(fb.email)) unique.set(fb.email, fb);
    });

    const results = await Promise.all([...unique.values()].map(async (fb) => {
      const seanceFeedback = await this.prisma.seanceFeedback.findFirst({
        where: { seanceId: fb.seanceId, userId: fb.userId },
        orderBy: { createdAt: 'desc' }
      });

      const ratings = [
        seanceFeedback?.sessionRating,
        seanceFeedback?.contentQuality,
        seanceFeedback?.sessionOrganization,
        seanceFeedback?.objectivesAchieved,
        seanceFeedback?.trainerRating,
        seanceFeedback?.trainerClarity,
        seanceFeedback?.trainerAvailability,
        seanceFeedback?.trainerPedagogy,
        seanceFeedback?.trainerInteraction,
        seanceFeedback?.teamRating,
        seanceFeedback?.teamCollaboration,
        seanceFeedback?.teamParticipation,
        seanceFeedback?.teamCommunication,
      ].filter(r => typeof r === 'number');

      const averageRating = ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2) : null;

      // Mapping adapté pour le frontend
      return {
        id: fb.id,
        userId: fb.userId,
        studentName: fb.nom,
        studentEmail: fb.email,
        fullFeedback: fb.feedback,
        averageRating,
      };
    }));

    return results;
  }

  async getFeedbackDetails(seanceId: number, userId: number) {
    // Récupérer le feedback détaillé de la séance
    const seanceFeedback = await this.prisma.seanceFeedback.findFirst({
      where: { seanceId, userId },
      orderBy: { createdAt: 'desc' },
      include: { user: true }
    });

    if (!seanceFeedback) {
      // Retourner un objet vide plutôt qu'une erreur
      return {
        id: null,
        seanceId,
        userId,
        studentName: '',
        studentEmail: '',
        sessionRating: null,
        contentQuality: null,
        sessionDuration: null,
        sessionOrganization: null,
        objectivesAchieved: null,
        trainerRating: null,
        trainerClarity: null,
        trainerAvailability: null,
        trainerPedagogy: null,
        trainerInteraction: null,
        teamRating: null,
        teamCollaboration: null,
        teamParticipation: null,
        teamCommunication: null,
        sessionComments: null,
        trainerComments: null,
        teamComments: null,
        suggestions: null,
        wouldRecommend: null,
        improvementAreas: null,
        createdAt: null,
      };
    }

    return {
      id: seanceFeedback.id,
      seanceId: seanceFeedback.seanceId,
      userId: seanceFeedback.userId,
      studentName: seanceFeedback.user?.name || '',
      studentEmail: seanceFeedback.user?.email || '',
      sessionRating: seanceFeedback.sessionRating,
      contentQuality: seanceFeedback.contentQuality,
      sessionDuration: seanceFeedback.sessionDuration,
      sessionOrganization: seanceFeedback.sessionOrganization,
      objectivesAchieved: seanceFeedback.objectivesAchieved,
      trainerRating: seanceFeedback.trainerRating,
      trainerClarity: seanceFeedback.trainerClarity,
      trainerAvailability: seanceFeedback.trainerAvailability,
      trainerPedagogy: seanceFeedback.trainerPedagogy,
      trainerInteraction: seanceFeedback.trainerInteraction,
      teamRating: seanceFeedback.teamRating,
      teamCollaboration: seanceFeedback.teamCollaboration,
      teamParticipation: seanceFeedback.teamParticipation,
      teamCommunication: seanceFeedback.teamCommunication,
      sessionComments: seanceFeedback.sessionComments,
      trainerComments: seanceFeedback.trainerComments,
      teamComments: seanceFeedback.teamComments,
      suggestions: seanceFeedback.suggestions,
      wouldRecommend: seanceFeedback.wouldRecommend,
      improvementAreas: seanceFeedback.improvementAreas,
      createdAt: seanceFeedback.createdAt,
    };
  }

  async cleanupOldFeedbacks(seanceId: number) {
    const all = await this.prisma.feedbackList.findMany({
      where: { seanceId },
      orderBy: { createdAt: 'desc' },
    });

    const latestMap = new Map<number, number>();
    all.forEach(fb => {
      if (!latestMap.has(fb.userId)) latestMap.set(fb.userId, fb.id);
    });

    const idsToDelete = all.filter(fb => latestMap.get(fb.userId) !== fb.id).map(fb => fb.id);
    if (!idsToDelete.length) return { deletedCount: 0 };

    const deleteResult = await this.prisma.feedbackList.deleteMany({ where: { id: { in: idsToDelete } } });
    return { deletedCount: deleteResult.count };
  }

  async deleteFeedbackListNotInEmails(seanceId: number, emailsToKeep: string[]) {
    if (!emailsToKeep.length) {
      // If no emails to keep, delete all feedback for the seance
      const deleteResult = await this.prisma.feedbackList.deleteMany({ where: { seanceId } });
      return { deletedCount: deleteResult.count };
    }

    const deleteResult = await this.prisma.feedbackList.deleteMany({
      where: {
        seanceId,
        email: { notIn: emailsToKeep },
      },
    });

    return { deletedCount: deleteResult.count };
  }
}
