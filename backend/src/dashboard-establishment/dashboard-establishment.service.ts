import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DashboardEstablishmentService {
  constructor(private prisma: PrismaService) {}
  async getEstablishmentStudents(establishmentName: string) {
    // Get students belonging to this establishment
    const students = await this.prisma.etudiant.findMany({
      where: {
        NameEtablissement: establishmentName
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true
          }
        }
      }
    });

    // Get sessions for these students with their enrollment info
    const studentsWithSessions = await Promise.all(
      students.map(async (student) => {
        // Get user sessions
        const userSessions = await this.prisma.userSession2.findMany({
          where: {
            userId: student.userId
          },
          include: {
            session2: {
              include: {
                program: {
                  select: { name: true }
                }
              }
            }
          }
        });

        // Calculate average rating for this student from feedback
        const sessionIds = userSessions.map(us => us.session2Id);
        
        // Get session feedbacks from this student
        const sessionFeedbacks = await this.prisma.sessionFeedback.findMany({
          where: {
            sessionId: { in: sessionIds },
            userId: student.userId
          },
          select: { rating: true }
        });

        // Get seance feedbacks from this student
        const seances = await this.prisma.seanceFormateur.findMany({
          where: {
            session2Id: { in: sessionIds }
          },
          select: { id: true }
        });

        const seanceFeedbacks = await this.prisma.seanceFeedback.findMany({
          where: {
            seanceId: { in: seances.map(s => s.id) },
            userId: student.userId
          },
          select: { sessionRating: true }
        });

        // Calculate average rating
        const allRatings = [
          ...sessionFeedbacks.map(f => f.rating).filter(r => typeof r === 'number'),
          ...seanceFeedbacks.map(f => f.sessionRating).filter(r => typeof r === 'number')
        ];

        const averageRating = allRatings.length > 0 
          ? parseFloat((allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2))
          : 0;

        return {
          id: student.id,
          userId: student.userId,
          name: student.User?.name || 'N/A',
          email: student.User?.email || 'N/A',
          profilePic: student.User?.profilePic,
          averageRating,
          sessions: userSessions.map(us => ({
            id: us.session2.id,
            name: us.session2.name,
            programName: us.session2.program?.name || 'N/A',
            status: us.session2.status,
            startDate: us.session2.startDate,
            endDate: us.session2.endDate
          }))
        };
      })
    );

    return studentsWithSessions;
  }

  // Get top students by rating for establishment
  async getTopStudentsByRating(establishmentName: string, limit: number = 3) {
    const students = await this.getEstablishmentStudents(establishmentName);
    
    // Sort by average rating and take top N
    return students
      .filter(student => student.averageRating > 0) // Only students with ratings
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  }
}
