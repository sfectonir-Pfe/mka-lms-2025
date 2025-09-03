import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class DashboardEstablishmentService {
  constructor(private prisma: PrismaService) {}


  // Get establishment statistics for the logged-in establishment user
  async getMyEstablishmentStats(userId: number) {
    
    // Find the establishment this user manages
    const userEstablishments = await this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (userEstablishments.length === 0) {
      console.log('No establishment found for user:', userId);
      return {
        totalStudents: 0,
        activeSessions: 0,
        totalSessions: 0,
        totalFeedbacks: 0
      };
    }

    const establishmentId = userEstablishments[0].id;
    const establishmentName = userEstablishments[0].name;
    console.log('Found establishment for user:', establishmentName, 'ID:', establishmentId);
    
    // Total students count using etablissement2Id
    const totalStudents = await this.prisma.etudiant.count({
      where: {
        etablissement2Id: establishmentId
      }
    });


    // Get all students for this establishment
    const students = await this.prisma.etudiant.findMany({
      where: {
        etablissement2Id: establishmentId
      },
      select: { userId: true }
    });

    const studentUserIds = students.map(s => s.userId);

    // Active sessions count (sessions with students from this establishment)
    const activeSessions = await this.prisma.session2.count({
      where: {
        status: 'ACTIVE',
        userSessions2: {
          some: {
            userId: {
              in: studentUserIds
            }
          }
        }
      }
    });

    // Total sessions count (all sessions with students from this establishment)
    const totalSessions = await this.prisma.session2.count({
      where: {
        userSessions2: {
          some: {
            userId: {
              in: studentUserIds
            }
          }
        }
      }
    });

    // Total feedbacks from students of this establishment
    const totalFeedbacks = await this.prisma.sessionFeedback.count({
      where: {
        userId: {
          in: studentUserIds
        }
      }
    });

    return {
      totalStudents,
      activeSessions,
      totalSessions,
      totalFeedbacks
    };
  }

  // Get establishment students for the logged-in establishment user
  async getMyEstablishmentStudents(userId: number) {
    
    // Find the establishment this user manages
    const userEstablishments = await this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (userEstablishments.length === 0) {
      console.log('No establishment found for user:', userId);
      return [];
    }

    const establishmentId = userEstablishments[0].id;
    const establishmentName = userEstablishments[0].name;
    console.log('Found establishment for user:', establishmentName, 'ID:', establishmentId);
    
    // Get students belonging to this establishment using etablissement2Id
    const students = await this.prisma.etudiant.findMany({
      where: {
        etablissement2Id: establishmentId
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePic: true
          }
        },
        Etablissement2: {
          select: {
            name: true
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
              select: {
                id: true,
                name: true,
                startDate: true,
                endDate: true,
                status: true,
                program: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        });

        return {
          id: student.User.id,
          name: student.User.name,
          email: student.User.email,
          profilePic: student.User.profilePic,
          establishmentName: student.Etablissement2?.name || establishmentName,
          sessions: userSessions.map(us => us.session2),
          totalSessions: userSessions.length
        };
      })
    );

    return studentsWithSessions;
  }






  // Get top students by rating for the logged-in establishment user
  async getMyTopStudentsByRating(userId: number, limit: number = 3) {
    // Find the establishment this user manages
    const userEstablishments = await this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (userEstablishments.length === 0) {
      return [];
    }

    const establishmentId = userEstablishments[0].id;

    // Get students from this establishment with their feedback ratings
    const students = await this.prisma.etudiant.findMany({
      where: {
        etablissement2Id: establishmentId
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

    const studentUserIds = students.map(s => s.userId);

    // Get feedback ratings for these students
    const studentsWithRatings = await Promise.all(
      students.map(async (student) => {
        const feedbacks = await this.prisma.sessionFeedback.findMany({
          where: {
            userId: student.userId
          },
          select: {
            rating: true,
            comments: true
          }
        });

        let totalScore = 0;
        let validScores = 0;

        feedbacks.forEach(fb => {
          let ratingsData = null;
          try {
            if (fb.comments) {
              const parsedComments = JSON.parse(fb.comments);
              ratingsData = parsedComments.ratings;
            }
          } catch (error) {
            console.error('Error parsing comments for ratings:', error);
          }
          
          // Simple rating calculation for now
          if (fb.rating && typeof fb.rating === 'number') {
            totalScore += fb.rating;
            validScores++;
          }
        });

        const averageRating = validScores > 0
          ? Math.round((totalScore / validScores) * 10) / 10
          : 0;

        return {
          id: student.User.id,
          name: student.User.name,
          email: student.User.email,
          profilePic: student.User.profilePic,
          averageRating,
          feedbackCount: validScores
        };
      })
    );

    // Sort by rating and return top students
    return studentsWithRatings
      .filter(student => student.averageRating > 0)
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, limit);
  }

  // Get student feedbacks for the logged-in establishment user
  async getMyStudentFeedbacks(userId: number, studentId?: number) {
    // Find the establishment this user manages
    const userEstablishments = await this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (userEstablishments.length === 0) {
      return [];
    }

    const establishmentId = userEstablishments[0].id;

    // Get students from this establishment
    const students = await this.prisma.etudiant.findMany({
      where: {
        etablissement2Id: establishmentId,
        ...(studentId && { userId: studentId })
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const studentUserIds = students.map(s => s.userId);

    // Get feedbacks from these students
    const feedbacks = await this.prisma.sessionFeedback.findMany({
      where: {
        userId: {
          in: studentUserIds
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        session: {
          select: {
            id: true,
            name: true,
            program: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return feedbacks.map(feedback => ({
      id: feedback.id,
      studentId: feedback.userId,
      studentName: feedback.user?.name || 'Utilisateur inconnu',
      studentEmail: feedback.user?.email || '',
      sessionName: feedback.session?.name || 'Session inconnue',
      programName: feedback.session?.program?.name || 'Programme inconnu',
      rating: feedback.rating,
      comments: feedback.comments,
      createdAt: feedback.createdAt
    }));
  }

  // Get student session history for the logged-in establishment user
  async getMyStudentSessionHistory(userId: number, studentId: number) {
    // Find the establishment this user manages
    const userEstablishments = await this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (userEstablishments.length === 0) {
      return [];
    }

    const establishmentId = userEstablishments[0].id;

    // Verify the student belongs to this establishment
    const student = await this.prisma.etudiant.findFirst({
      where: {
        userId: studentId,
        etablissement2Id: establishmentId
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!student) {
      return [];
    }

    // Get session history for this student
    const userSessions = await this.prisma.userSession2.findMany({
      where: {
        userId: studentId
      },
      include: {
        session2: {
          include: {
            program: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return userSessions.map(us => ({
      sessionId: us.session2.id,
      sessionName: us.session2.name,
      programName: us.session2.program?.name || 'Programme inconnu',
      startDate: us.session2.startDate,
      endDate: us.session2.endDate,
      status: us.session2.status,
      joinedAt: us.createdAt
    }));
  }

  // Get establishment sessions for the logged-in establishment user
  async getMyEstablishmentSessions(userId: number) {
    // Find the establishment this user manages
    const userEstablishments = await this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });

    if (userEstablishments.length === 0) {
      return [];
    }

    const establishmentId = userEstablishments[0].id;

    // Get students from this establishment
    const students = await this.prisma.etudiant.findMany({
      where: {
        etablissement2Id: establishmentId
      },
      select: { userId: true }
    });

    const studentUserIds = students.map(s => s.userId);

    // Get sessions that have students from this establishment
    const sessions = await this.prisma.session2.findMany({
      where: {
        userSessions2: {
          some: {
            userId: {
              in: studentUserIds
            }
          }
        }
      },
      include: {
        program: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return sessions;
  }
}
