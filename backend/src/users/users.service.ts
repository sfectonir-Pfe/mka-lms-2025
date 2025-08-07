import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "nestjs-prisma" // Removed 'type' keyword
import type { CreateUserDto } from "./dto/create-user.dto"
import type { UpdateUserDto } from "./dto/update-user.dto"
import * as bcrypt from "bcrypt"
import { MailService } from "../mail/mail.service" // Removed 'type' keyword
import type { Role } from "@prisma/client"
import { ConflictException } from '@nestjs/common';



@Injectable()
export class UsersService {
  // Stockage temporaire des utilisateurs quand la DB n'est pas disponible
  private fallbackUsers: any[] = [
    {
      id: 1,
      email: "khalil@gmail.com",
      role: "Admin",
      name: "Khalil ",
      phone: null,
      profilePic: null,
      location: null,
      skills: [],
      about: null,
      isActive: true,
    },
  ]

  constructor(
    private readonly prisma: PrismaService, // 🔧 Injection directe
    private readonly mailService: MailService, // 🔧 Injection directe
  ) {
    console.log("🚀 UsersService initialized")
    console.log("📧 MailService available:", !!this.mailService)
    console.log("🗄️ PrismaService available:", !!this.prisma)
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private generateTempPassword(length = 10): string {
    const upperChars = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    const lowerChars = "abcdefghijkmnopqrstuvwxyz"
    const numbers = "23456789"
    const specialChars = "@#$%&*!?"

    let password = ""
    password += upperChars.charAt(Math.floor(Math.random() * upperChars.length))
    password += lowerChars.charAt(Math.floor(Math.random() * lowerChars.length))
    password += numbers.charAt(Math.floor(Math.random() * numbers.length))
    password += specialChars.charAt(Math.floor(Math.random() * specialChars.length))

    const allChars = upperChars + lowerChars + numbers + specialChars
    const remainingLength = length - 4

    for (let i = 0; i < remainingLength; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length))
    }

    return password
      .split("")
      .sort(() => 0.5 - Math.random())
      .join("")
  }

  async create(createUserDto: CreateUserDto) {
    // ✅ Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Cet utilisateur existe déjà.');
    }

    const tempPassword = this.generateTempPassword();
    const hashedPassword = await this.hashPassword(tempPassword);

    const newUser = await this.prisma.user.create({
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

    if (createUserDto.session2Ids && createUserDto.session2Ids.length > 0) {
      for (const sessionId of createUserDto.session2Ids) {
        await this.addUserToSession2(newUser.id, sessionId);
      }
    }

    try {
      await this.mailService.sendWelcomeEmail(
        newUser.email,
        tempPassword,
        newUser.role,
      );
      console.log(`✅ Email de bienvenue envoyé à ${newUser.email}`);
    } catch (emailError) {
      console.error(`❌ Erreur lors de l'envoi de l'email à ${newUser.email}:`, emailError);
    }

    return newUser;
  }

  async findAll() {
    try {
      const users = await this.prisma.user.findMany({
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
          isActive: true,
        },
      })
      return users
    } catch (error) {
      return this.fallbackUsers
    }
  }

  async findOne(id: number) {
    try {
      return await this.prisma.user.findUnique({
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
          isActive: true,
        },
      })
    } catch (error) {
      console.error("❌ Error in findOne:", error)
      // Fallback search
      return this.fallbackUsers.find((user) => user.id === id) || null
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const updateData: {
        name?: string
        role?: Role
        phone?: string
        location?: string
        about?: string
        skills?: any
        profilePic?: string
        isActive?: boolean
      } = {}

      if (updateUserDto.name !== undefined) updateData.name = updateUserDto.name
      if (updateUserDto.role !== undefined) updateData.role = updateUserDto.role
      if (updateUserDto.phone !== undefined) updateData.phone = updateUserDto.phone
      if (updateUserDto.location !== undefined) updateData.location = updateUserDto.location
      if (updateUserDto.about !== undefined) updateData.about = updateUserDto.about
      if (updateUserDto.skills !== undefined) updateData.skills = updateUserDto.skills as any
      if (updateUserDto.profilePic !== undefined) updateData.profilePic = updateUserDto.profilePic

      if (updateUserDto.isActive !== undefined) {
        updateData.isActive = Boolean(updateUserDto.isActive)
      }

      return await this.prisma.user.update({
        where: { id },
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
          isActive: true,
        },
      })
    } catch (error) {
      console.error("❌ Error in update:", error)
      throw error
    }
  }

  async toggleUserStatus(id: number, isActive?: boolean) {
    try {
      console.log("🔄 Service: Toggling user status for ID:", id)

      if (isActive === undefined) {
        const currentUser = await this.prisma.user.findUnique({
          where: { id },
          select: { isActive: true },
        })

        if (!currentUser) {
          throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`)
        }

        isActive = !currentUser.isActive
      }

      const activeStatus = Boolean(isActive)
      console.log("✅ Service: Setting isActive to:", activeStatus)

      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: { isActive: activeStatus },
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
          isActive: true,
        },
      })

      console.log("✅ Service: User status updated successfully:", updatedUser)
      return updatedUser
    } catch (error) {
      console.error("❌ Service: Error in toggleUserStatus:", error)

      if (error instanceof NotFoundException) {
        throw error
      }

      console.log("🔄 Service: Attempting fallback toggle for user ID:", id)

      const userIndex = this.fallbackUsers.findIndex((user) => user.id === id)
      if (userIndex === -1) {
        throw new NotFoundException(`Utilisateur avec l'ID ${id} non trouvé`)
      }

      if (isActive === undefined) {
        isActive = !this.fallbackUsers[userIndex].isActive
      }

      this.fallbackUsers[userIndex].isActive = Boolean(isActive)
      console.log("✅ Service: Fallback user status updated:", this.fallbackUsers[userIndex])

      return this.fallbackUsers[userIndex]
    }
  }

  async toggleUserStatusByEmail(email: string, isActive?: boolean) {
    try {
      console.log("🔄 Service: Toggling user status for email:", email)

      if (isActive === undefined) {
        const currentUser = await this.prisma.user.findUnique({
          where: { email },
          select: { isActive: true },
        })

        if (!currentUser) {
          throw new NotFoundException(`Utilisateur avec l'email ${email} non trouvé`)
        }

        isActive = !currentUser.isActive
      }

      const activeStatus = Boolean(isActive)
      console.log("✅ Service: Setting isActive to:", activeStatus)

      const updatedUser = await this.prisma.user.update({
        where: { email },
        data: { isActive: activeStatus },
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
          isActive: true,
        },
      })

      console.log("✅ Service: User status updated successfully:", updatedUser)
      return updatedUser
    } catch (error) {
      console.error("❌ Service: Error in toggleUserStatusByEmail:", error)

      if (error instanceof NotFoundException) {
        throw error
      }

      console.log("🔄 Service: Attempting fallback toggle for user email:", email)

      const userIndex = this.fallbackUsers.findIndex((user) => user.email === email)
      if (userIndex === -1) {
        throw new NotFoundException(`Utilisateur avec l'email ${email} non trouvé`)
      }

      if (isActive === undefined) {
        isActive = !this.fallbackUsers[userIndex].isActive
      }

      this.fallbackUsers[userIndex].isActive = Boolean(isActive)
      console.log("✅ Service: Fallback user status updated:", this.fallbackUsers[userIndex])

      return this.fallbackUsers[userIndex]
    }
  }

  async remove(id: number) {
    try {
      console.log("🗑️ Attempting to delete user with ID:", id)
      const deletedUser = await this.prisma.user.delete({
        where: { id },
      })
      console.log("✅ User deleted from database successfully:", deletedUser)
      return deletedUser
    } catch (error) {
      console.error("❌ Database error in remove:", error.message)
      console.log("🔄 Attempting to delete from fallback storage")

      const userIndex = this.fallbackUsers.findIndex((user) => user.id === id)

      if (userIndex === -1) {
        console.error("❌ User not found in fallback storage with ID:", id)
        throw new Error(`User with ID ${id} not found`)
      }

      const deletedUser = this.fallbackUsers.splice(userIndex, 1)[0]
      console.log("✅ User deleted from fallback storage:", deletedUser)
      console.log("💾 Remaining users in fallback storage:", this.fallbackUsers.length)

      return deletedUser
    }
  }

  async findById(id: number) {
    try {
      const numericId = Number.parseInt(String(id), 10)
      if (isNaN(numericId)) throw new Error("ID invalide")

      return await this.prisma.user.findUnique({
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
          isActive: true,
        },
      })
    } catch (error) {
      console.error("❌ Erreur dans findById:", error)
      throw error
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
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
          isActive: true,
        },
      })
    } catch (error) {
      console.error("❌ Error in findByEmail:", error)
      return this.fallbackUsers.find((user) => user.email === email) || null
    }
  }

  async updateByEmail(email: string, updateUserDto: UpdateUserDto) {
    try {
      console.log("🔄 Mise à jour de l'utilisateur avec email:", email)
      console.log("📝 Données reçues:", updateUserDto)

      if (updateUserDto.skills) {
        console.log("🛠️ Skills avant traitement:", updateUserDto.skills)
        console.log("📝 Type de skills:", typeof updateUserDto.skills)

        if (typeof updateUserDto.skills === "string") {
          try {
            if (updateUserDto.skills.startsWith("[") && updateUserDto.skills.endsWith("]")) {
              updateUserDto.skills = JSON.parse(updateUserDto.skills as unknown as string)
              console.log("✅ Skills après parsing JSON:", updateUserDto.skills)
            } else {
              updateUserDto.skills = [updateUserDto.skills]
              console.log("🔄 Skills convertis en tableau:", updateUserDto.skills)
            }
          } catch (e) {
            console.error("❌ Failed to parse skills:", e)
            updateUserDto.skills = []
          }
        } else if (Array.isArray(updateUserDto.skills)) {
          console.log("✅ Skills est déjà un tableau:", updateUserDto.skills)
        } else {
          console.error("⚠️ Format de skills non reconnu, conversion en tableau vide")
          updateUserDto.skills = []
        }
      }

      const updateData: {
        name?: string
        phone?: string
        location?: string
        about?: string
        skills?: any
        profilePic?: string
        isActive?: boolean
      } = {
        name: updateUserDto.name,
        phone: updateUserDto.phone,
        location: updateUserDto.location,
        about: updateUserDto.about,
      }

      if (updateUserDto.skills !== undefined) {
        updateData.skills = updateUserDto.skills
      }

      if (updateUserDto.profilePic !== undefined) {
        updateData.profilePic = updateUserDto.profilePic
      }

      if (updateUserDto.isActive !== undefined) {
        updateData.isActive = Boolean(updateUserDto.isActive)
      }

      return await this.prisma.user.update({
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
          isActive: true,
        },
      })
    } catch (error) {
      console.error("❌ Erreur dans updateByEmail:", error)
      throw error
    }
  }

  async updateProfilePic(id: number, profilePicPath: string) {
    try {
      return await this.prisma.user.update({
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
          isActive: true,
        },
      })
    } catch (error) {
      console.error("❌ Erreur dans updateProfilePic:", error)
      throw error
    }
  }

  async addUserToSession2(userId: number, session2Id: number) {
    return this.prisma.userSession2.create({
      data: { userId, session2Id }
    });
  }

  async getSessionsForUser(userId: number) {
    return this.prisma.userSession2.findMany({
      where: { userId },
      include: { session2: true }
    });
  }

  async getStudents() {
    return this.prisma.user.findMany({
      where: { role: 'Etudiant' },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async getSeanceFormateur(seanceId: number) {
    return this.prisma.seanceFormateur.findUnique({
      where: { id: seanceId },
      select: { session2Id: true }
    });
  }

  async getUserSessions2(session2Id: number) {
    return this.prisma.userSession2.findMany({
      where: { session2Id },
      select: { userId: true }
    });
  }

  async getStudentsByIds(studentIds: number[]) {
    return this.prisma.user.findMany({
      where: {
        id: { in: studentIds },
        role: 'Etudiant'
      },
      select: { id: true, name: true, email: true, role: true }
    });
  }

  async getFeedbacks(formateurId: number, seanceId: number) {
    return this.prisma.feedbackFormateur.findMany({
      where: { userId: formateurId, seanceId },
      select: { studentId: true }
    });
  }
// user.service.ts
// user.service.ts
async getUserSessions(userId: number) {
  const sessions = await this.prisma.userSession2.findMany({
    where: { userId },
    include: {
      session2: {
        include: {
          program: true, // include program info if you want
        },
      },
    },
  });
  console.log("getUserSessions result for userId:", userId, "\n", JSON.stringify(sessions, null, 2));
  return sessions;
}


}
