import { Injectable } from '@nestjs/common';
import { CreateFeedbackÉtudiantDto } from './dto/create-feedback-étudiant.dto';
import { UpdateFeedbackÉtudiantDto } from './dto/update-feedback-étudiant.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FeedbackÉtudiantService {
  constructor(private prisma: PrismaService) {}

  // Méthodes pour les feedbacks entre étudiants
  async createStudentFeedback(fromStudentId: number, createFeedbackDto: CreateFeedbackÉtudiantDto) {
    try {
      // Empêcher l'auto-feedback
      if (fromStudentId === createFeedbackDto.toStudentId) {
        throw new Error('Un étudiant ne peut pas se donner un feedback à lui-même');
      }
      
      const group = await this.prisma.studentGroup.findUnique({
        where: { id: createFeedbackDto.groupId },
        include: { students: true }
      });

      if (!group) {
        throw new Error('Groupe non trouvé');
      }

      const isFromStudentInGroup = group.students.some(s => s.id === fromStudentId);
      const isToStudentInGroup = group.students.some(s => s.id === createFeedbackDto.toStudentId);

      if (!isFromStudentInGroup || !isToStudentInGroup) {
        throw new Error('Les étudiants doivent être dans le même groupe');
      }

      const existingFeedback = await this.prisma.studentFeedback.findFirst({
  where: {
    fromStudentId,
    toStudentId: createFeedbackDto.toStudentId,
    groupId: createFeedbackDto.groupId,
    category: createFeedbackDto.category, // ← IMPORTANT
  }
});

if (existingFeedback) {
  throw new Error('Vous avez déjà donné un feedback pour cette catégorie à cet étudiant dans ce groupe');
}


      return await this.prisma.studentFeedback.create({
        data: {
          fromStudentId,
          toStudentId: createFeedbackDto.toStudentId,
          groupId: createFeedbackDto.groupId,
          rating: createFeedbackDto.rating,
          comment: createFeedbackDto.comment,
          category: createFeedbackDto.category,
          isAnonymous: createFeedbackDto.isAnonymous || false
        },
        include: {
          fromStudent: { select: { id: true, name: true } },
          toStudent: { select: { id: true, name: true } },
          group: { select: { id: true, name: true } }
        }
      });
    } catch (error) {
      console.error('Erreur création feedback:', error);
      throw error;
    }
  }

  async getStudentFeedbacks(studentId: number, groupId?: string) {
    try {
      const where: any = { toStudentId: studentId };
      if (groupId) where.groupId = groupId;

      return await this.prisma.studentFeedback.findMany({
        where,
        include: {
          fromStudent: { select: { id: true, name: true } },
          group: { select: { id: true, name: true } }
        },
        orderBy: { createdAt: 'desc' }
      });
    } catch (error) {
      console.error('Erreur récupération feedbacks:', error);
      return [];
    }
  }

  // Méthodes pour les groupes
  async createGroup(createGroupDto: CreateGroupDto) {
    return await this.prisma.studentGroup.create({
      data: {
        name: createGroupDto.name,
        seanceId: createGroupDto.seanceId,
        students: {
          connect: createGroupDto.studentIds?.map(id => ({ id })) || []
        }
      },
      include: { 
        students: {
          where: { role: 'Etudiant' },
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async getGroupsBySeance(seanceId: string) {
    try {
      console.log('🔍 Recherche groupes pour seanceId:', seanceId);
      const groups = await this.prisma.studentGroup.findMany({
        where: { seanceId: parseInt(seanceId) },
        include: { 
          students: { 
            where: { role: 'Etudiant' }, // Filtrer uniquement les étudiants
            select: { id: true, name: true, email: true, role: true } 
          } 
        }
      });
      console.log('✅ Groupes trouvés:', groups);
      return groups;
    } catch (error) {
      console.error('❌ Erreur getGroupsBySeance:', error);
      return [];
    }
  }

  async deleteGroup(id: string) {
    await this.prisma.studentGroup.delete({ where: { id } });
    return { message: 'Group deleted successfully' };
  }

  async addStudentToGroup(groupId: string, studentId: number) {
    // Vérifier que l'utilisateur est bien un étudiant
    const user = await this.prisma.user.findUnique({
      where: { id: studentId },
      select: { role: true }
    });
    
    if (user?.role !== 'Etudiant') {
      throw new Error('Seuls les étudiants peuvent être ajoutés aux groupes');
    }
    
    return await this.prisma.studentGroup.update({
      where: { id: groupId },
      data: {
        students: {
          connect: { id: studentId }
        }
      },
      include: { 
        students: {
          where: { role: 'Etudiant' },
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async removeStudentFromGroup(groupId: string, studentId: number) {
    return await this.prisma.studentGroup.update({
      where: { id: groupId },
      data: {
        students: {
          disconnect: { id: studentId }
        }
      },
      include: { 
        students: {
          where: { role: 'Etudiant' },
          select: { id: true, name: true, email: true }
        }
      }
    });
  }

  async getStudentsBySeance(seanceId: string) {
    try {
      console.log('🔍 Recherche étudiants pour seanceId:', seanceId);
      
      // Récupérer la séance et sa session associée
      const seance = await this.prisma.seanceFormateur.findUnique({
        where: { id: parseInt(seanceId) },
        include: { session2: true }
      });

      if (!seance) {
        console.log('❌ Séance non trouvée');
        return [];
      }

      // Récupérer UNIQUEMENT les étudiants inscrits à cette session
      const userSessions = await this.prisma.userSession2.findMany({
        where: { 
          session2Id: seance.session2Id,
          user: {
            role: 'Etudiant' // Filtrer directement dans la requête
          }
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, role: true }
          }
        }
      });

      // Mapper les résultats
      const students = userSessions.map(us => ({
        id: us.user.id,
        name: us.user.name,
        email: us.user.email
      }));

      console.log('✅ Étudiants trouvés:', students.length, students);
      return students;
    } catch (error) {
      console.error('❌ Erreur getStudentsBySeance:', error);
      return [];
    }
  }

  async updateGroup(id: string, updateGroupDto: UpdateGroupDto) {
    return await this.prisma.studentGroup.update({
      where: { id },
      data: {
        ...(updateGroupDto.name && { name: updateGroupDto.name }),
        ...(updateGroupDto.studentIds && {
          students: {
            set: updateGroupDto.studentIds.map(id => ({ id }))
          }
        })
      },
      include: { students: true }
    });
  }

  async getGroupFeedbackSummary(groupId: string) {
    try {
      const feedbacks = await this.prisma.studentFeedback.findMany({
        where: { groupId },
        include: {
          fromStudent: { select: { id: true, name: true } },
          toStudent: { select: { id: true, name: true } }
        }
      });

      const studentStats = {};
      feedbacks.forEach(feedback => {
        const studentId = feedback.toStudentId;
        if (!studentStats[studentId]) {
          studentStats[studentId] = {
            student: feedback.toStudent,
            totalRating: 0,
            count: 0,
            feedbacks: [],
            categories: {}
          };
        }
        
        studentStats[studentId].totalRating += feedback.rating;
        studentStats[studentId].count += 1;
        studentStats[studentId].feedbacks.push(feedback);
        
        if (!studentStats[studentId].categories[feedback.category]) {
          studentStats[studentId].categories[feedback.category] = { total: 0, count: 0 };
        }
        studentStats[studentId].categories[feedback.category].total += feedback.rating;
        studentStats[studentId].categories[feedback.category].count += 1;
      });

      Object.keys(studentStats).forEach(studentId => {
        const stats = studentStats[studentId];
        stats.averageRating = stats.count > 0 ? (stats.totalRating / stats.count).toFixed(1) : 0;
        
        Object.keys(stats.categories).forEach(category => {
          const catStats = stats.categories[category];
          catStats.average = (catStats.total / catStats.count).toFixed(1);
        });
      });

      return studentStats;
    } catch (error) {
      console.error('Erreur résumé feedbacks groupe:', error);
      return {};
    }
  }

  async updateStudentFeedback(feedbackId: string, fromStudentId: number, updateData: UpdateFeedbackÉtudiantDto) {
    try {
      const feedback = await this.prisma.studentFeedback.findUnique({
        where: { id: feedbackId }
      });

      if (!feedback || feedback.fromStudentId !== fromStudentId) {
        throw new Error('Feedback non trouvé ou non autorisé');
      }

      return await this.prisma.studentFeedback.update({
        where: { id: feedbackId },
        data: updateData,
        include: {
          fromStudent: { select: { id: true, name: true } },
          toStudent: { select: { id: true, name: true } },
          group: { select: { id: true, name: true } }
        }
      });
    } catch (error) {
      console.error('Erreur mise à jour feedback:', error);
      throw error;
    }
  }

  async deleteStudentFeedback(feedbackId: string, fromStudentId: number) {
    try {
      const feedback = await this.prisma.studentFeedback.findUnique({
        where: { id: feedbackId }
      });

      if (!feedback || feedback.fromStudentId !== fromStudentId) {
        throw new Error('Feedback non trouvé ou non autorisé');
      }

      await this.prisma.studentFeedback.delete({
        where: { id: feedbackId }
      });

      return { message: 'Feedback supprimé avec succès' };
    } catch (error) {
      console.error('Erreur suppression feedback:', error);
      throw error;
    }
  }



  // Méthodes pour la page FeedbackEtudiant
  async getCurrentStudent(userId: number) {
    try {
      console.log('🔍 getCurrentStudent - Recherche utilisateur avec ID:', userId);
      
      if (!userId || isNaN(userId)) {
        console.error('❌ getCurrentStudent - userId invalide:', userId);
        throw new Error('ID utilisateur invalide');
      }
      
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true }
      });
      
      console.log('👤 getCurrentStudent - Utilisateur trouvé:', user);
      
      if (!user) {
        console.log('⚠️ Utilisateur non trouvé, création d\'un utilisateur de test');
        const testUser = await this.prisma.user.create({
          data: {
            name: 'Etudiant Test',
            email: `etudiant.test.${Date.now()}@test.com`,
            password: 'test123',
            role: 'Etudiant',
            needsVerification: false,
            isActive: true
          }
        });
        console.log('🆕 Utilisateur de test créé:', testUser);
        return { id: testUser.id, name: testUser.name, email: testUser.email, role: testUser.role };
      }
      
      return user;
    } catch (error) {
      console.error('Erreur getCurrentStudent:', error);
      throw error;
    }
  }

  async getStudentGroupBySeance(studentId: number, seanceId: string) {
    try {
      console.log('🔍 getStudentGroupBySeance - Recherche groupe pour studentId:', studentId, 'seanceId:', seanceId);
      
      // Vérifier d'abord que l'utilisateur est un étudiant
      const user = await this.prisma.user.findUnique({
        where: { id: studentId },
        select: { id: true, name: true, email: true, role: true }
      });
      
      console.log('👤 getStudentGroupBySeance - Utilisateur:', user);
      
      if (!user || user.role !== 'Etudiant') {
        console.log('❌ getStudentGroupBySeance - Utilisateur n\'est pas un étudiant, accès refusé');
        return null;
      }
      
      // Lister tous les groupes pour cette séance pour déboguer
      const allGroups = await this.prisma.studentGroup.findMany({
        where: { seanceId: parseInt(seanceId) },
        include: {
          students: {
            where: { role: 'Etudiant' },
            select: { id: true, name: true, email: true }
          }
        }
      });
      
      console.log('📋 getStudentGroupBySeance - Tous les groupes pour cette séance:', allGroups.map(g => ({
        id: g.id,
        name: g.name,
        students: g.students.map(s => ({ id: s.id, name: s.name }))
      })));
      
      // Chercher le groupe de l'étudiant pour cette séance
      let group = await this.prisma.studentGroup.findFirst({
        where: {
          seanceId: parseInt(seanceId),
          students: {
            some: { id: studentId }
          }
        },
        include: {
          students: {
            where: { role: 'Etudiant' },
            select: { id: true, name: true, email: true }
          }
        }
      });
      
      console.log('👥 getStudentGroupBySeance - Groupe trouvé pour l\'étudiant:', group ? {
        id: group.id,
        name: group.name,
        students: group.students.map(s => ({ id: s.id, name: s.name }))
      } : null);
      
      // Si aucun groupe trouvé, créer un groupe par défaut
      if (!group) {
        console.log('⚠️ Aucun groupe trouvé, création d\'un groupe par défaut');
        
        group = await this.prisma.studentGroup.create({
          data: {
            name: `Groupe ${user.name}`,
            seanceId: parseInt(seanceId),
            students: {
              connect: { id: studentId }
            }
          },
          include: {
            students: {
              where: { role: 'Etudiant' },
              select: { id: true, name: true, email: true }
            }
          }
        });
        
        console.log('✅ Nouveau groupe créé:', group);
      }
      

      
      return group;
    } catch (error) {
      console.error('Erreur getStudentGroupBySeance:', error);
      return null;
    }
  }

  async getFeedbackQuestions(groupId: string, currentStudentId?: number) {
    try {
      console.log('🔍 getFeedbackQuestions - groupId:', groupId, 'currentStudentId:', currentStudentId);
      
      // Récupérer le groupe avec ses étudiants
      const group = await this.prisma.studentGroup.findUnique({
        where: { id: groupId },
        include: {
          students: {
            where: { role: 'Etudiant' },
            select: { id: true, name: true, email: true }
          }
        }
      });
      
      if (!group || group.students.length < 2) {
        console.log('⚠️ Groupe insuffisant:', group?.students.length || 0, 'étudiants');
        return [];
      }
      
      // Filtrer pour exclure l'étudiant courant
      const filteredStudents = currentStudentId 
        ? group.students.filter(s => s.id !== currentStudentId)
        : group.students;
      
      console.log('👥 Étudiants filtrés (sans étudiant courant):', filteredStudents);

      // Une seule question générale puisqu'on stocke un feedback par paire
      const questions = [
        {
          id: 1,
          text: 'Comment évaluez-vous cet étudiant dans le groupe ?',
          type: 'general',
          category: 'general'
        }
      ];

      // Récupérer les feedbacks existants pour ce groupe
      const existingFeedbacks = await this.prisma.studentFeedback.findMany({
        where: { 
          groupId,
          ...(currentStudentId && { fromStudentId: currentStudentId })
        },
        select: {
          fromStudentId: true,
          toStudentId: true,
          rating: true
        }
      });

      // Ajouter les feedbacks existants aux questions
      const questionsWithFeedbacks = questions.map(question => ({
        ...question,
        groupStudents: filteredStudents,
        feedbacks: existingFeedbacks.map(f => ({
          studentId: f.fromStudentId,
          targetStudentId: f.toStudentId,
          reaction: this.mapRatingToReaction(f.rating)
        }))
      }));

      return questionsWithFeedbacks;
    } catch (error) {
      console.error('Erreur getFeedbackQuestions:', error);
      return [];
    }
  }

  async submitFeedback(feedbackData: any) {
    try {
      const { questionId, studentId, targetStudentId, reaction, groupId, seanceId } = feedbackData;
      
      console.log('📝 submitFeedback - Données reçues:', { questionId, studentId, targetStudentId, reaction, groupId });
      
      // Vérifier que studentId n'est pas undefined
      if (!studentId) {
        console.error('❌ studentId manquant dans les données:', feedbackData);
        throw new Error('studentId est requis');
      }
      
      // Vérifier que targetStudentId n'est pas undefined
      if (!targetStudentId) {
        console.error('❌ targetStudentId manquant dans les données:', feedbackData);
        throw new Error('targetStudentId est requis');
      }
      
      // Empêcher l'auto-feedback
      if (studentId === targetStudentId) {
        throw new Error('Un étudiant ne peut pas se donner un feedback à lui-même');
      }
      
      // Convertir la réaction en note
      const rating = this.mapReactionToRating(reaction);
      console.log('📝 Rating calculé:', rating, 'pour reaction:', reaction);
      
      // Utiliser une catégorie générale puisqu'on ne stocke qu'un feedback par paire
      const category = 'general';
      
      // Utiliser upsert pour créer ou mettre à jour
      console.log('🔄 Upsert feedback avec:', {
        fromStudentId: studentId,
        toStudentId: targetStudentId,
        groupId,
        rating,
        category
      });
      
      // Utiliser upsert avec la contrainte unique existante
      return await this.prisma.studentFeedback.upsert({
        where: {
          fromStudentId_toStudentId_groupId: {
            fromStudentId: studentId,
            toStudentId: targetStudentId,
            groupId
          }
        },
        update: {
          rating,
          comment: `Emoji: ${reaction}`,
          category,
          updatedAt: new Date()
        },
        create: {
          fromStudentId: studentId,
          toStudentId: targetStudentId,
          groupId,
          rating,
          comment: `Emoji: ${reaction}`,
          category,
          isAnonymous: false
        }
      });
    } catch (error) {
      console.error('❌ Erreur submitFeedback:', error);
      throw error;
    }
  }

  private mapReactionToRating(reaction: string): number {
    const mapping = {
      'excellent': 5,
      'very_good': 4,
      'good': 3,
      'average': 2,
      'poor': 1
    };
    return mapping[reaction] || 3;
  }

  private mapRatingToReaction(rating: number): string {
    const mapping = {
      5: 'excellent',
      4: 'very_good',
      3: 'good',
      2: 'average',
      1: 'poor'
    };
    return mapping[rating] || 'good';
  }

  // Méthodes existantes (placeholder)
  create(createFeedbackÉtudiantDto: CreateFeedbackÉtudiantDto) {
    return 'This action adds a new feedbackÉtudiant';
  }

  findAll() {
    return `This action returns all feedbackÉtudiant`;
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true, email: true, role: true }
      });
      return user;
    } catch (error) {
      console.error('Erreur findOne:', error);
      return null;
    }
  }

  update(id: number, updateFeedbackÉtudiantDto: UpdateFeedbackÉtudiantDto) {
    return `This action updates a #${id} feedbackÉtudiant`;
  }

  remove(id: number) {
    return `This action removes a #${id} feedbackÉtudiant`;
  }

  async getStudentFeedbacksByGroup(groupId: string, studentId: number) {
    try {
      const feedbacks = await this.prisma.studentFeedback.findMany({
        where: {
          groupId,
          fromStudentId: studentId
        },
        include: {
          toStudent: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      // Transform feedbacks to include reaction mapping for frontend compatibility
      return feedbacks.map(feedback => ({
        ...feedback,
        reaction: this.mapRatingToReaction(feedback.rating),
        questionId: this.mapCategoryToQuestionId(feedback.category),
        targetStudentId: feedback.toStudentId
      }));
    } catch (error) {
      console.error('Erreur getStudentFeedbacksByGroup:', error);
      return [];
    }
  }

  private mapCategoryToQuestionId(category: string): number {
    const mapping = {
      'collaboration': 1,
      'communication': 2,
      'participation': 3,
      'qualite_travail': 4
    };
    return mapping[category] || 1;
  }

  async getStudentRatingSummary(groupId: string) {
    try {
      const feedbacks = await this.prisma.studentFeedback.findMany({
        where: { groupId },
        include: {
          toStudent: { select: { id: true, name: true, email: true } }
        }
      });

      const studentRatings = {};
      
      feedbacks.forEach(feedback => {
        const studentId = feedback.toStudentId;
        if (!studentRatings[studentId]) {
          studentRatings[studentId] = {
            student: feedback.toStudent,
            totalPoints: 0,
            feedbackCount: 0,
            maxPossiblePoints: 0
          };
        }
        
        studentRatings[studentId].totalPoints += feedback.rating;
        studentRatings[studentId].feedbackCount += 1;
        studentRatings[studentId].maxPossiblePoints += 5; // Max 5 points per feedback
      });

      // Calculate ratings for each student
      Object.keys(studentRatings).forEach(studentId => {
        const data = studentRatings[studentId];
        data.rating = data.maxPossiblePoints > 0 
          ? parseFloat(((data.totalPoints / data.maxPossiblePoints) * 5).toFixed(1))
          : 0;
      });

      return studentRatings;
    } catch (error) {
      console.error('Erreur getStudentRatingSummary:', error);
      return {};
    }
  }

  async getEmojiSummary(groupId: string) {
    try {
      const feedbacks = await this.prisma.studentFeedback.findMany({
        where: { groupId },
        include: {
          fromStudent: { select: { id: true, name: true } },
          toStudent: { select: { id: true, name: true } }
        }
      });

      const summary = {};
      feedbacks.forEach(feedback => {
        const reaction = this.mapRatingToReaction(feedback.rating);
        const key = `${feedback.category}_${feedback.toStudentId}`;
        
        if (!summary[key]) {
          summary[key] = {
            studentId: feedback.toStudentId,
            studentName: feedback.toStudent.name,
            category: feedback.category,
            reactions: {}
          };
        }
        
        if (!summary[key].reactions[reaction]) {
          summary[key].reactions[reaction] = 0;
        }
        summary[key].reactions[reaction]++;
      });

      return Object.values(summary);
    } catch (error) {
      console.error('Erreur getEmojiSummary:', error);
      return [];
    }
  }




}