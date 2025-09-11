import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class Etablissement2Service {
  constructor(private prisma: PrismaService) {}

  async create(name: string) {
    console.log('Creating Etablissement2:', name);
    return this.prisma.etablissement2.create({
      data: { name },
    });
  }

  async findAll() {
    return this.prisma.etablissement2.findMany();
  }

  async findByUserId(userId: number) {
    // Find establishment where this user is a responsable
    return this.prisma.etablissement2.findMany({
      where: {
        responsables: {
          some: {
            userId: userId
          }
        }
      }
    });
  }

  async getEstablishmentInfo(userId: number) {
    // First, get the user to check their role
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return { establishment: null, students: [] };
    }

    // If user is a responsable etablissement, find their establishment
    if (user.role?.toLowerCase() === 'etablissement') {
      const etablissement = await this.prisma.etablissement.findFirst({
        where: { userId },
        include: {
          Etablissement2: {
            include: {
              etudiants: {
                include: {
                  User: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      if (!etablissement || !etablissement.Etablissement2) {
        return { establishment: null, students: [] };
      }

      return {
        establishment: etablissement.Etablissement2,
        students: etablissement.Etablissement2.etudiants.map(etudiant => etudiant.User)
      };
    }

    // If user is a student, find their establishment through Etudiant record
    if (user.role?.toLowerCase() === 'etudiant') {
      const etudiant = await this.prisma.etudiant.findFirst({
        where: { userId },
        include: {
          Etablissement2: true
        }
      });

      if (!etudiant || !etudiant.Etablissement2) {
        return { establishment: null, students: [] };
      }

      return {
        establishment: etudiant.Etablissement2,
        students: [] // Students don't need to see other students
      };
    }

    // For other roles (formateur, admin, etc.), try to find any establishment they might be associated with
    // This is a fallback - you might need to adjust based on your specific business logic
    return { establishment: null, students: [] };
  }
}
