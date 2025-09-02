// src/etudiant-dashboard/etudiant-dashboard.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Session2Status } from '@prisma/client';



@Injectable()
export class EtudiantDashboardService {
  constructor(private prisma: PrismaService) {}

  // Get all joined sessions for a user, with session info + status string
  async getJoinedSessionsByEtudiant(userId: number) {
    // Fetch UserSession2 for the user, with session2 info
    const joined = await this.prisma.userSession2.findMany({
      where: { userId },
      include: {
        session2: true,
      },
    });

    // Status logic: terminée / en cours / à venir
    const now = new Date();
    const sessions = joined.map((j) => {
      let statut = "en cours";
      if (j.session2.endDate && now > j.session2.endDate) statut = "terminée";
      else if (j.session2.startDate && now < j.session2.startDate) statut = "à venir";

      return {
        sessionId: j.session2.id,
        sessionName: j.session2.name,
        startDate: j.session2.startDate,
        endDate: j.session2.endDate,
        status: j.session2.status, // ACTIVE, COMPLETED, etc.
        statut, // terminée, en cours, à venir
      };
    });

    return sessions;
  }

  // For stats card: count of joined sessions per status
  async getJoinedSessionStats(userId: number) {
    const sessions = await this.getJoinedSessionsByEtudiant(userId);
    return {
      total: sessions.length,
      terminee: sessions.filter((s) => s.statut === "terminée").length,
      encours: sessions.filter((s) => s.statut === "en cours").length,
      avenir: sessions.filter((s) => s.statut === "à venir").length,
    };
  }

  // Get feedback received by a student
  async getFeedbackReceived(userId: number) {
    try {
      // Get feedback from other students
      const fromStudents = await this.prisma.studentFeedback.findMany({
        where: { toStudentId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      // Get feedback from formateurs (session feedback) - simplified for now
      const fromFormateurs = await this.prisma.sessionFeedback.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: 10
      });

      // Calculate average rating from student feedback
      const studentRatings = fromStudents
        .map(f => f.rating)
        .filter(r => r && r > 0);
      
      const formateurRatings = fromFormateurs
        .map(f => f.rating)
        .filter(r => r && r > 0);

      const allRatings = [...studentRatings, ...formateurRatings];
      const averageRating = allRatings.length > 0 
        ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length 
        : 0;

      return {
        fromStudents: fromStudents.map(f => ({
          id: f.id,
          rating: f.rating,
          comment: f.comment,
          authorName: 'Étudiant',
          sessionName: 'Session',
          createdAt: f.createdAt
        })),
        fromFormateurs: fromFormateurs.map(f => {
          // Parse the comments field if it's a JSON string
          let cleanComment = '';
          try {
            if (f.comments) {
              const parsed = JSON.parse(f.comments);
              cleanComment = parsed.feedback || parsed.overallComments || parsed.formData?.overallComments || '';
            }
          } catch (error) {
            // If not JSON, use the raw comment
            cleanComment = f.comments || '';
          }
          
          return {
            id: f.id,
            rating: f.rating,
            comment: cleanComment,
            authorName: 'Formateur',
            sessionName: 'Session',
            createdAt: f.createdAt
          };
        }),
        averageRating: Math.round(averageRating * 10) / 10,
        totalCount: fromStudents.length + fromFormateurs.length
      };
    } catch (error) {
      console.error('Error fetching feedback received:', error);
      return {
        fromStudents: [],
        fromFormateurs: [],
        averageRating: 0,
        totalCount: 0
      };
    }
  }

  // Get top students by rating
  async getTopStudents(limit: number = 3) {
    try {
      // Get all students
      const students = await this.prisma.user.findMany({
        where: { role: 'Etudiant' },
        select: {
          id: true,
          name: true,
          email: true
        }
      });

      // Get feedback for each student and calculate ratings
      const studentsWithRatings = await Promise.all(
        students.map(async (student) => {
          const studentFeedbacks = await this.prisma.studentFeedback.findMany({
            where: { toStudentId: student.id },
            select: { rating: true }
          });

          const sessionFeedbacks = await this.prisma.sessionFeedback.findMany({
            where: { userId: student.id },
            select: { rating: true }
          });

          const studentRatings = studentFeedbacks
            .map(f => f.rating)
            .filter(r => r && r > 0);
          
          const sessionRatings = sessionFeedbacks
            .map(f => f.rating)
            .filter(r => r && r > 0);

          const allRatings = [...studentRatings, ...sessionRatings];
          const averageRating = allRatings.length > 0 
            ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length 
            : 0;

          return {
            id: student.id,
            name: student.name,
            email: student.email,
            averageRating: Math.round(averageRating * 10) / 10,
            feedbackCount: allRatings.length
          };
        })
      );

      // Sort by rating and return top students
      return studentsWithRatings
        .filter(s => s.averageRating > 0)
        .sort((a, b) => b.averageRating - a.averageRating)
        .slice(0, limit);
    } catch (error) {
      console.error('Error fetching top students:', error);
      return [];
    }
  }
}
