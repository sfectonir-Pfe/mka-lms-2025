import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);
    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        role: createUserDto.role,
        name: createUserDto.name,
        phone: createUserDto.phone,
        location: createUserDto.location,
        about: createUserDto.about,
        skills: createUserDto.skills ? [createUserDto.skills] : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        location: true,
        about: true,
        skills: true,
        profilePic: true,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        role: updateUserDto.role,
        phone: updateUserDto.phone,
        location: updateUserDto.location,
        about: updateUserDto.about,
        skills: Array.isArray(updateUserDto.skills)
          ? updateUserDto.skills
          : (typeof updateUserDto.skills === 'string'
            ? [updateUserDto.skills]
            : undefined),
        profilePic: updateUserDto.profilePic,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profilePic: true,
        location: true,
        skills: true,
        about: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findById(id: number) {
    try {
      // Convertir l'ID en nombre
      const numericId = parseInt(String(id), 10);

      if (isNaN(numericId)) {
        throw new Error('ID invalide');
      }

      return this.prisma.user.findUnique({
        where: { id: numericId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          profilePic: true,
          location: true,
          skills: true,
          about: true,
        },
      });
    } catch (error) {
      console.error('Erreur dans findById:', error);
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        profilePic: true,
        location: true,
        skills: true,
        about: true,
      },
    });
  }

  async updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    try {
      console.log("Mise à jour de l'utilisateur avec email:", email);
      console.log("Données reçues:", updateUserDto);

      // Parse skills from string if needed
      if (updateUserDto.skills) {
        console.log("Skills avant traitement:", updateUserDto.skills);
        console.log("Type de skills:", typeof updateUserDto.skills);

        if (typeof updateUserDto.skills === 'string') {
          try {
            // Si c'est une chaîne JSON, essayer de la parser
            if (updateUserDto.skills.startsWith('[') && updateUserDto.skills.endsWith(']')) {
              updateUserDto.skills = JSON.parse(updateUserDto.skills as unknown as string);
              console.log("Skills après parsing JSON:", updateUserDto.skills);
            } else {
              // Si c'est une chaîne simple, la convertir en tableau avec un seul élément
              updateUserDto.skills = [updateUserDto.skills];
              console.log("Skills convertis en tableau:", updateUserDto.skills);
            }
          } catch (e) {
            console.error('Failed to parse skills:', e);
            updateUserDto.skills = [];
          }
        } else if (Array.isArray(updateUserDto.skills)) {
          console.log("Skills est déjà un tableau:", updateUserDto.skills);
        } else {
          console.error("Format de skills non reconnu, conversion en tableau vide");
          updateUserDto.skills = [];
        }
      }

      // Créer un objet de données
      const updateData: any = {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        location: updateUserDto.location,
        about: updateUserDto.about,
      };

      // Ajouter le champ skills seulement s'il est défini
      if (updateUserDto.skills !== undefined) {
        updateData.skills = updateUserDto.skills;
      }

      // Ajouter le champ profilePic seulement s'il est défini
      if (updateUserDto.profilePic !== undefined) {
        updateData.profilePic = updateUserDto.profilePic;
      }

      console.log("Données à mettre à jour:", updateData);

      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          profilePic: true,
          location: true,
          skills: true,
          about: true,
        },
      });

      console.log("Utilisateur mis à jour:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Erreur dans updateByEmail:", error);
      throw error;
    }
  }

  async updateProfilePic(id: number, profilePicPath: string) {
    try {
      console.log("Mise à jour de la photo de profil pour l'utilisateur avec ID:", id);
      console.log("Chemin de la photo:", profilePicPath);

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          profilePic: profilePicPath,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          profilePic: true,
          location: true,
          skills: true,
          about: true,
        },
      });

      console.log("Photo de profil mise à jour:", updatedUser);
      return updatedUser;
    } catch (error) {
      console.error("Erreur dans updateProfilePic:", error);
      throw error;
    }
  }
}
